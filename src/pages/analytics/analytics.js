//Auth & Firebase
import {auth, db} from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {getWallets} from "../walletsReducer";
import {getRecords} from "../recordsReducer";

//Components
import {DataInitialization} from "../../components/data-initialization";

//React stuff
import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Select from 'react-select';

//Css
import "./analytics.css"

//Options
import {categories, dataRangeOptions, getIconClassForCategory} from "../../components/options";

//Charts
import {Chart} from "chart.js/auto";
export const Analytics = (props) => {

    const [user, loading] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;

    const recordsList = useSelector((state) => state.records.recordsList);
    const walletsList = useSelector((state) => state.wallets.walletsList);
    const isLoading = useSelector((state) => state.wallets.loading && state.records.loading);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalExpensesPercentage, setTotalExpensesPercentage] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalIncomePercentage, setTotalIncomePercentage] = useState(0);

    const [selectedRange, setSelectedRange] = useState("lifetime")
    const [selectedWallet, setSelectedWallet] = useState("all")


    useEffect(() => {
        //Fetching all wallets and transactions
        if(userId) {
            dispatch(getRecords({userId}));
            dispatch(getWallets(userId));
        }
    }, [dispatch, userId]);

    const [chartData, setChartData] = useState({
        labels: categories,
        expenses: [],
        incomes: []
    });

    const chartCanvasRef = useRef(null);
    let chartInstance = null;

    const donutChartCanvasRef = useRef(null);
    let donutChartInstance = null;


    useEffect(() => {
        // Update chart data arrays whenever selectedRange or selectedWallet changes
        const expensesData = categories.map(category =>
            calculateAmounts(category, selectedWallet, true)
        );
        const incomesData = categories.map(category =>
            calculateAmounts(category, selectedWallet, false)
        );

        setChartData({
            ...chartData,
            expenses: expensesData,
            incomes: incomesData
        });
    }, [selectedRange, selectedWallet, recordsList]);

    useEffect(() => {
        // Update chart data arrays whenever selectedRange or selectedWallet changes
        const expensesData = categories.map((category) =>
            calculateAmounts(category, selectedWallet, true)
        );
        const incomesData = categories.map((category) =>
            calculateAmounts(category, selectedWallet, false)
        );

        const ctx = chartCanvasRef.current.getContext("2d");


        if (chartInstance) {
            chartInstance.destroy(); // Destroy the previous chart instance
        }

        if (ctx) {
            chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: categories,
                    datasets: [
                        {
                            label: "Incomes",
                            data: incomesData,
                            // borderColor: "rgba(75, 192, 192, 1)",
                            // backgroundColor: "rgba(75, 192, 192, 0.2)",
                            //borderWidth: 1,
                        },
                        {
                            label: "Expenses",
                            data: expensesData,
                            // borderColor: "rgba(255, 99, 132, 1)",
                            // backgroundColor: "rgba(255, 99, 132, 0.2)",
                            //borderWidth: 1,
                        },

                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value, index, values) {
                                    return "$ " + value.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    });
                                },
                            },
                        },
                    },
                },
            });
        }

        return () => {
            // Cleanup: Destroy the chart instance when the component unmounts
            if (chartInstance) {
                chartInstance.destroy();
            }
        };

    }, [selectedRange, selectedWallet]);

    useEffect(() => {
        const donutCtx = donutChartCanvasRef.current?.getContext("2d");

        if (donutChartInstance) {
            donutChartInstance.destroy();
        }

        if (donutCtx) {
            donutChartInstance = new Chart(donutCtx, {
                type: "doughnut",
                data: {
                    labels: ["Incomes", "Expenses"],
                    datasets: [
                        {
                            data: [totalIncome, totalExpenses],
                            // backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(75, 192, 192, 0.7)"],
                            // borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
                        },
                    ],
                },
                options: {
                    // ... Customize chart options as needed ...
                },
            });
        }

        return () => {
            if (donutChartInstance) {
                donutChartInstance.destroy();
                donutChartInstance = null;
            }
        };
    }, [selectedWallet,selectedRange, totalIncome, totalExpenses]);

    useEffect(() => {
        // Calculate total expenses whenever the recordsList or selectedRange changes
        if (recordsList && recordsList.length > 0) {
            const calculatedTotalExpenses = categories.reduce((total, category) => {
                const expenses = calculateAmounts(category, selectedWallet, true);
                return total + expenses;
            }, 0);

            const calculatedTotalIncomes = categories.reduce((total, category) => {
                const incomes = calculateAmounts(category, selectedWallet, false);
                return total + incomes;
            }, 0);

            const TotalBoth = calculatedTotalExpenses + calculatedTotalIncomes;

            setTotalExpenses(calculatedTotalExpenses);
            setTotalIncome(calculatedTotalIncomes);

            setTotalExpensesPercentage(calculatedTotalExpenses/TotalBoth*100);
            setTotalIncomePercentage(calculatedTotalIncomes/TotalBoth*100);
        }
    }, [recordsList, selectedRange, selectedWallet]);


    //ANOTHER SOLUTION IN APP.JS
    // useEffect(() => {
    //     if (!loading && !user) {
    //         if (props.history) {
    //             props.history.push("/");
    //         }
    //         else navigate("/");
    //     }
    // }, [loading, user, props.history]);

    //UNUSED
    // if (isLoading) {
    //     return (
    //         <DataInitialization/>
    //     )
    // }
    const calculateAmounts = (category, selectedWallet, isExpense) => {
        let filteredRecords = recordsList.filter((record) =>
            record.userId === userId &&
            record.category === category &&
            record.isExpense === isExpense
        );
        // Apply filtering based on selectedRange
        const currentDate = new Date();
        const endDate = new Date(currentDate);
        let startDate = new Date(currentDate);

        switch (selectedRange) {
            case "lifetime":
                break;

            case "today":
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                break;

            case "last7days":
                startDate.setDate(endDate.getDate() - 7);
                break;

            case "last-month":
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                endDate.setDate(0); // Set to last day of previous month
                break;

            case "last-year":
                startDate.setFullYear(currentDate.getFullYear() - 1);
                startDate.setMonth(0);
                startDate.setDate(1);
                endDate.setFullYear(currentDate.getFullYear() - 1);
                endDate.setMonth(11);
                endDate.setDate(31);
                break;

            case "this-week":
                startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week
                endDate.setDate(startDate.getDate() + 6); // End of the week
                break;

            case "this-month":
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate.setMonth(currentDate.getMonth() + 1, 0); // Set to last day of current month
                break;

            case "this-year":
                startDate.setFullYear(currentDate.getFullYear(), 0, 1);
                endDate.setFullYear(currentDate.getFullYear(), 11, 31);
                break;

            default:
                // No additional filtering needed for unknown range
                break;
        }

        if (selectedRange !== "lifetime") {
            filteredRecords = filteredRecords.filter(record => {
                const recordDate = new Date(record.dateTime)
                return recordDate >= startDate && recordDate <= endDate;
            });
        }

        if (selectedWallet !== "all") {
            filteredRecords = filteredRecords.filter(record => record.walletId === selectedWallet);
        }

        const totalAmount = filteredRecords.reduce((total, record) => total + record.amount, 0);
        return totalAmount;


    };

    const dateRangeOptions = [
        { value: "lifetime", label: "Lifetime" },
        { value: "today", label: "Today" },
        { value: "last7days", label: "Last 7 Days" },
        { value: "last-month", label: "Last Month" },
        { value: "last-year", label: "Last Year" },
        { value: "this-week", label: "This Week" },
        { value: "this-month", label: "This Month" },
        { value: "this-year", label: "This Year" },
    ];



    return (
        <div className="main-content">
            <div className="analytics-wrap">
                <div className="container">
                    <div className="head-analytics-box">
                        <div className="row">
                            <div className="col-md-6">
                                <h2 className="blue-colored">Incomes & Expenses Report</h2>
                            </div>
                            <div className="col-md-6">
                                <div className="head-analytics-box-items">
                                    <div className="sort-section item">
                                        {/*<label htmlFor="categorySelect" className="label">Wallet name</label>*/}
                                        <Select
                                            defaultValue={{ value: 'all', label: 'All wallets' }}
                                            value={selectedWallet.value}
                                            onChange={option => setSelectedWallet(option.value)}
                                            options={[
                                                { value: 'all', label: 'All wallets' }, // Add 'All' option
                                                ...walletsList.map(wallet => ({ value: wallet.id, label: wallet.name }))
                                            ]}
                                            className="sort-range sort"
                                        />
                                    </div>
                                    <div className="sort-section item">
                                        {/*<span>Data Range:</span>*/}
                                        <Select
                                            defaultValue={{value: "lifetime", label: "Lifetime"}}
                                            value={selectedRange.value}
                                            onChange={option => setSelectedRange(option.value)}
                                            options={dateRangeOptions}
                                            className="sort-range sort"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="analytics-box">
                    <div className="row">
                        <div className="col-md-6">
                            <table className="analytics-table">
                                <thead>
                                <tr>
                                    <th colSpan={2} className="col-md-">Category</th>
                                    <th></th>
                                    <th></th>
                                    <th className="col-md-">Expenses</th>
                                    <th className="col-md-">Income</th>
                                </tr>
                                </thead>
                                <tbody>
                                {categories.map(category => (
                                    <tr key={category} className="category-analytics">
                                        <td colSpan={2} className="col-md-">
                                            <i className={`category-icon fas ${getIconClassForCategory(category)}`}></i> {category}
                                        </td>
                                        <td></td>
                                        <td></td>

                                        <td className="col-md-"><i className="fa-solid fa-dollar-sign"></i> {calculateAmounts(category, selectedWallet, true).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}</td>
                                        <td className="col-md-"><i className="fa-solid fa-dollar-sign"></i> {calculateAmounts(category, selectedWallet, false).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <th colSpan={2}>Total</th>
                                    <td></td>
                                    <td></td>
                                    <th className="col-md-"><i className="fa-solid fa-dollar-sign"></i> {totalExpenses.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}</th>
                                    <th className="col-md-"><i className="fa-solid fa-dollar-sign"></i> {totalIncome.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}</th>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <div className="chart-box">
                                {/*<h5>Analytics</h5>*/}
                                <h4>{totalIncome-totalExpenses < 0 ? <span><i className="fa-solid fa-caret-down"></i> ${Math.abs(Number((totalIncome-totalExpenses).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })))}</span> : <span><i className="fa-solid fa-caret-up"></i>${Math.abs(Number((totalIncome-totalExpenses).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })))}</span> }</h4>
                                <canvas ref={chartCanvasRef} id="expenseIncomeChart"></canvas>
                            </div>
                            <div className="donut">
                                <canvas ref={donutChartCanvasRef} id="donutChart"></canvas>

                                {/*<div className="stats-percentage">*/}
                                        {/*    <div className="stats-percentage-item">*/}
                                        {/*        <span>Expenses</span>*/}
                                        {/*        <h4>{totalExpensesPercentage ? totalExpensesPercentage.toFixed(0) : 0}%</h4>*/}
                                        {/*    </div>*/}
                                        {/*    <div className="stats-percentage-item">*/}
                                        {/*        <span>Income</span>*/}
                                        {/*        <h4>{totalIncomePercentage ? totalIncomePercentage.toFixed(0) : 0}%</h4>*/}
                                        {/*    </div>                                      */}
                                        {/*</div>*/}

                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )};
