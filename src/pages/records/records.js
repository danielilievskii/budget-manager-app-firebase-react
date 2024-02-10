//Auth & Firebase
import {auth, db} from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {getWallets} from "../walletsReducer";
import {getRecords} from "../recordsReducer";

//Components
import {RecordModal} from "./create-record-modal";
import {DeleteRecordModal} from "./delete-record-modal";
import {UpdateRecordModal} from "./update-record-modal";
import {DataInitialization} from "../../components/data-initialization";

//Css
import "./records.css";

//React stuff
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Select from "react-select";
import {useNavigate} from "react-router-dom";

//Toast Notification
import {toast, ToastContainer} from "react-toastify";

//Options
import {getIconClassForCategory, sortOptions, dataRangeOptions} from "../../components/options";

export const Records = (props) => {

    const [user, loading] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;

    const recordsList = useSelector((state) => state.records.recordsList);
    const walletsList = useSelector((state) => state.wallets.walletsList);
    const isLoading = useSelector((state) => state.wallets.loading && state.records.loading);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedRecord, setSelectedRecord] = useState([]);

    const [deleteRecordModal, setDeleteRecordModal] = useState(false);
    const toggleDeleteRecordModal = () => {
        setDeleteRecordModal(!deleteRecordModal);
    }

    const [updateRecordModal, setUpdateRecordModal] = useState(false);
    const toggleUpdateRecordModal = () => {
        setUpdateRecordModal(!updateRecordModal);
    }

    //Order
    const [sortOrder, setSortOrder] = useState("newest");

    //Data range
    const [selectedDateRange, setSelectedDateRange] = useState("all"); // Default to "all" to show all records


    useEffect(() => {
        //Fetching all wallets and transactions
        if(userId) {
            dispatch(getRecords({userId, sortOrder}));
            dispatch(getWallets(userId));
            console.log(recordsList);
            console.log(groupedRecords)
        }
    }, [dispatch, userId, sortOrder, selectedDateRange]);


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


    //GROUPING BY DATA RANGE
    const groupRecordsByDate = (recordsList, selectedDateRange) => {
        const groupedRecords = {};
        const today = new Date();

        recordsList?.forEach((record) => {
            const recordDate = new Date(record.dateTime);

            // Filter records based on the selected date range
            if (selectedDateRange === "today" && recordDate.toDateString() === today.toDateString()) {
                const date = today.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            } else if (selectedDateRange === "7days" && isWithinLastDays(recordDate, 7)) {
                const date = recordDate.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            } else if (selectedDateRange === "30days" && isWithinLastDays(recordDate, 30)) {
                const date = recordDate.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            } else if (selectedDateRange === "90days" && isWithinLastDays(recordDate, 90)) {
                const date = recordDate.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            } else if (selectedDateRange === "12months" && isWithinLastMonths(recordDate, 12)) {
                const date = recordDate.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            } else if (selectedDateRange === "thisWeek" && isWithinThisWeek(recordDate)) {
                const date = recordDate.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            } else if (selectedDateRange === "thisMonth" && isWithinThisMonth(recordDate)) {
                const date = recordDate.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            } else if (selectedDateRange === "thisYear" && isWithinThisYear(recordDate)) {
                const date = recordDate.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            } else if (selectedDateRange === "all") {
                const date = recordDate.toDateString();
                if (groupedRecords[date]) {
                    groupedRecords[date].push(record);
                } else {
                    groupedRecords[date] = [record];
                }
            }
        });

        return groupedRecords;
    };

// Helper functions for the new date ranges
    const isWithinLastDays = (date, numDays) => {
        const today = new Date();
        const lastDate = new Date();
        lastDate.setDate(today.getDate() - numDays);
        return date >= lastDate && date <= today;
    };

    const isWithinLastMonths = (date, numMonths) => {
        const today = new Date();
        const lastDate = new Date();
        lastDate.setMonth(today.getMonth() - numMonths);
        return date >= lastDate && date <= today;
    };
    const isWithinThisWeek = (date) => {
        const today = new Date();
        const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        return date >= lastWeek && date <= today;
    };

    const isWithinThisMonth = (date) => {
        const today = new Date();
        const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return date >= firstDayThisMonth && date <= lastDayThisMonth;
    };

    const isWithinThisYear = (date) => {
        const today = new Date();
        const firstDayThisYear = new Date(today.getFullYear(), 0, 1);
        const lastDayThisYear = new Date(today.getFullYear(), 11, 31);
        return date >= firstDayThisYear && date <= lastDayThisYear;
    };
    const groupedRecords = groupRecordsByDate(recordsList, selectedDateRange);


    //Formated date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            const options = { year: "numeric", month: "short", day: "2-digit" };
            return date.toLocaleDateString(undefined, options);
        }
    };



    return (
            <div className="main-content">
                <div className="transactions-wrap">
                    <div className="container">
                        <div className="head-transactions-box">
                            <div className="row">
                                <div className="col-md-4">
                                    <h2 className="blue-colored">Transactions</h2>
                                </div>
                                <div className="col-md-8">
                                    <div className="head-transactions-box-items">

                                        <div className="sort-section item">
                                            <Select
                                                defaultValue={{value: "newest", label: "Date (newest first)"}}
                                                value={sortOrder.value}
                                                onChange ={option => setSortOrder(option.value)}
                                                options = {sortOptions}
                                                className="sort-range sort"
                                            />
                                        </div>
                                        <div className="date-range-section item">
                                            <Select
                                                defaultValue={{value: "all", label: "Lifetime"}}
                                                value={selectedDateRange.value}
                                                onChange={option => setSelectedDateRange(option.value)}
                                                options={dataRangeOptions}
                                                className="date-range sort"
                                            />
                                        </div>
                                        <RecordModal sortOrder={sortOrder} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="transactions-box">
                            {recordsList.length > 0 ? (Object.entries(groupedRecords).map(([date, recordsList]) => (
                                <div key={date}>
                                    <h6 className="record-date blue-colored">{formatDate(date)}</h6>

                                    {recordsList.map((record) => (
                                        <div className="single-record" key={record.id}>
                                            <div className="row">
                                                <div className="col-md-10">
                                                    <h3 >{record.place}</h3>
                                                    <span className={`record-value`}> <i className={`category-icon fas ${getIconClassForCategory(record.category)}`}></i> {record.category} </span>
                                                    <span className="record-value "><i className="fas fa-comment "></i> <span className="gray-colored">{record.note ? record.note.length > 50 ? record.note.slice(0, 50) + "..." : record.note : "No description"}</span></span>
                                                    <span className="record-value "><i className="fas fa-calendar "></i> {record.dateTime}</span>
                                                    <span className="record-value cap-wallet "><i className="fas fa-wallet "></i> {record.walletName}</span>
                                                </div>
                                                <div className="col-md-2 aligned-right custom-margin-right">
                                                    {record.isExpense ? ( <span className="record-value red">- {record.amount.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })} <i
                                                            className="fa-solid fa-dollar-sign"></i> </span>)
                                                        : (<span className="record-value green">+ {record.amount.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })} <i
                                                                className="fa-solid fa-dollar-sign"></i></span>
                                                        )}

                                                    <i className="fa-solid fa-pen-to-square pen-edit-btn" onClick={() => {
                                                        setSelectedRecord(record);
                                                        toggleUpdateRecordModal();
                                                    }}></i>

                                                    <i className="fa-solid fa-trash trash-delete-btn" onClick={() => {
                                                        setSelectedRecord(record);
                                                        toggleDeleteRecordModal();
                                                    }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            ))) : <div className="no-transactions"> <p>No transactions found.</p></div>}
                        </div>

                    </div>

                </div>
                { deleteRecordModal && (
                    <DeleteRecordModal record={selectedRecord} sortOrder={sortOrder} toggleDeleteRecordModal={toggleDeleteRecordModal} />
                )}

                { updateRecordModal && (
                    <UpdateRecordModal record={selectedRecord} updateRecordModal={updateRecordModal} sortOrder={sortOrder} toggleUpdateRecordModal={toggleUpdateRecordModal} />
                )}

                <ToastContainer />
            </div>
    );
};