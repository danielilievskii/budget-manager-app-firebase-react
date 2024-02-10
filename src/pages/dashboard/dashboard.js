//Auth & Firebase
import {auth, db} from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {getWallets} from "../walletsReducer";
import {getRecords} from "../recordsReducer";

//Components
import {AddWalletModal} from "./add-wallet-modal";
import {UpdateWalletModal} from "./update-wallet-modal";
import {DeleteWalletModal} from "./delete-wallet-modal";
import {DataInitialization} from "../../components/data-initialization";

//Css
import "./dashboard.css"
import "../modal/modal.css"

//React stuff
import React, {useEffect, useState, createContext} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {NavLink, useNavigate} from "react-router-dom";

//Carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

//Toast Notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Options
import {getIconClassForCategory} from "../../components/options";

export const Dashboard = (props) => {
    const [user, loading, loadingUser] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const walletsList = useSelector((state) => state.wallets.walletsList);
    const recordsList = useSelector((state) => state.records.recordsList);
    const isLoading = useSelector((state) => state.wallets.loading && state.records.loading);

    //DELETE WALLET
    const [deleteWalletModal, setDeleteWalletModal] = useState(false);
    const toggleDeleteWalletModal = () => {
        setDeleteWalletModal(!deleteWalletModal);
    }

    //UPDATE WALLET
    const [selectedWallet, setSelectedWallet] = useState([]);
    const [updateWalletModal, setUpdateWalletModal] = useState(false);
    const toggleUpdateWalletModal = () => {
        setUpdateWalletModal(!updateWalletModal);
    }

    //RECENT HISTORY BOX
    const [latestThreeRecords, setLatestThreeRecords] = useState([]);

    //ANALYTICS BOX
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncomes, setTotalIncomes] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);

    //SEARCH BOX
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredWallets, setFilteredWallets] = useState([]);

    useEffect(() => {
        //Fetching all wallets and transactions
        if(userId) {
            dispatch(getWallets(userId));
            dispatch(getRecords({userId}));
        }
    }, [dispatch, user, selectedWallet]);

    useEffect(() => {
        //Fetching latest 3 transactions
        if(userId) {
            const sortedRecords = [...recordsList].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
            setLatestThreeRecords(sortedRecords.slice(0, 3));
            //dispatch(getRecords({userId})); za update na recent history rekordite
        }

    }, [dispatch, userId, recordsList])


    useEffect(() => {
        //Filtering wallets after search
        const filteredList = walletsList.filter(wallet =>
            wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredWallets(filteredList);
    }, [searchTerm, walletsList]);


    const calculateExpenses = () => {
        let filteredRecords = recordsList.filter((record) =>
            (record.userId === userId) && (record.isExpense === true)
        );
        const totalAmount = filteredRecords.reduce((total, record) => total + record.amount, 0);
        return totalAmount;
    }

    const calculateIncomes = () => {
        let filteredRecords = recordsList.filter((record) =>
            (record.userId === userId) && (record.isExpense === false)
        );
        const totalAmount = filteredRecords.reduce((total, record) => total + record.amount, 0);
        return totalAmount;
    }

    const calculateBalance = () => {
        let filteredWallets = walletsList.filter((wallet) =>
            (wallet.userId === userId)
        );
        const totalBalance = filteredWallets.reduce((total, wallet) => total + wallet.balance, 0);
        return totalBalance;
    }

    useEffect(() => {
        if (recordsList && recordsList.length > 0) {
            const calculatedTotalExpenses = calculateExpenses();
            setTotalExpenses(calculatedTotalExpenses);

            const calculatedTotalIncomes = calculateIncomes();
            setTotalIncomes(calculatedTotalIncomes);
        }

            const calculatedTotalBalance = calculateBalance();
            setTotalBalance(calculatedTotalBalance);

    }, )

    //ANOTHER SOLUTION IN APP.JS
    // useEffect(() => {
    //     //Redirecting to login page if user tries to access the page unsigned.
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

    const walletTypeToIcon = {
        'General': 'general-colored.png',
        'Credit Card': 'atm-card.png',
        'Digital': 'digital.png',
        'Cash': 'cash-colored4.png',
        'Crypto': 'crypto-colored4.png',
    };


    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1400 },
            items: 4,
            slidesToSlide: 2 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1400, min: 768 },
            items: 3,
            slidesToSlide: 3 // optional, default to 1.
        },

        mobile: {
            breakpoint: { max: 767, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    return (
                <div className="main-content">
                    <div className="dashboard-wrap">
                        <div className="container">
                            <div className="head-dashboard-box">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h2 className="head-component blue-colored">Dashboard</h2>
                                    </div>
                                    <div className="col-md-6">
                                        <AddWalletModal />
                                        <div className="search-container head-component">
                                            <i className="fa-solid fa-magnifying-glass blue-colored"></i>
                                            <input
                                                className="search-input"
                                                type="text"
                                                placeholder="Search wallet..."
                                                value={searchTerm}
                                                onChange={event => setSearchTerm(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="wallets-box">
                                <h4 className="blue-colored">Wallets</h4>
                                {walletsList.length > 0 ? (
                                    <Carousel
                                        swipeable={true}
                                        draggable={true}
                                        showDots={true}
                                        responsive={responsive}
                                        //ssr={true} // means to render carousel on server-side.
                                        infinite={false}
                                        autoPlaySpeed={1000}
                                        keyBoardControl={true}
                                        // customTransition="all .5"
                                        transitionDuration={1000}
                                        //containerClass="carousel-container"
                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                        dotListClass={"custom-dot-list-style"}
                                        itemClass="carousel-item-padding-40-px"
                                    >
                                        {filteredWallets?.map(wallet => (
                                            <div className="single-wallet" key={wallet.id} >
                                                <div className="back-drop" style={{backgroundImage: `url(/wallet-images/${walletTypeToIcon[wallet.type]})`}}>
                                                    <h3>{wallet.name.length > 16 ? wallet.name.toUpperCase().slice(0, 16) + "..." : wallet.name.toUpperCase()}</h3>

                                                    {/*<h3>{wallet.name}</h3>*/}

                                                    <h6>{wallet.type}</h6>
                                                    <h5><i className="fa-solid fa-dollar-sign"></i> {wallet.balance.toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}</h5>

                                                    <i className="fa-solid fa-pen-to-square pen-edit-btn" onClick={() => {
                                                        setSelectedWallet(wallet);

                                                        toggleUpdateWalletModal();
                                                    }}></i>

                                                    <i className="fa-solid fa-trash trash-delete-btn" onClick={() => {
                                                        toggleDeleteWalletModal();
                                                        setSelectedWallet(wallet);
                                                    }}></i>
                                                </div>
                                            </div>
                                        ))}
                                    </Carousel>
                                ) : <div className="no-wallets"> <p>No wallets found.</p></div>}
                            </div>


                            <div className="history-analytics-box">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="top">
                                            <h4 className="blue-colored">Recent History</h4>
                                            <h6 className="blue-colored"><NavLink to="/records">See All</NavLink></h6>

                                        </div>
                                        <div className="row">
                                            {recordsList.length >0 ? (latestThreeRecords.map((record) => (
                                                <div className="single-record-dash" key={record.id}>
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <h3>{record.place}</h3>
                                                            <span className={`record-value`}> <i className={`category-icon fas ${getIconClassForCategory(record.category)}`}></i> {record.category} </span>
                                                            <span className="record-value "><i className="fas fa-comment "></i> <span className="gray-colored">{record.note ? record.note.length > 50 ? record.note.slice(0, 30) + "..." : record.note : "No description"}</span></span>
                                                            <span className="record-value"><i className="fas fa-calendar"></i> {record.dateTime}</span>
                                                            <span className="record-value cap-wallet"><i className="fas fa-wallet"></i> {record.walletName}</span>
                                                        </div>
                                                        <div className="col-md-2 aligned-right">
                                                            {record.isExpense ? ( <span className="record-value red">- {record.amount.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })} <i className="fa-solid fa-dollar-sign"></i> </span>)
                                                                : (<span className="record-value green">+ {record.amount.toLocaleString(undefined, {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    })} <i className="fa-solid fa-dollar-sign"></i></span>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))) : <div className="no-history"> <p>No recent history.</p></div>}
                                        </div>

                                    </div>

                                    <div className="col-md-4">
                                        <h4 className="blue-colored">Analytics Box</h4>
                                        <div className="aligned analytics-box-dash">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="total-box">
                                                        <h5>Total Expenses</h5>
                                                        <h3><i className="fa-solid fa-dollar-sign"></i> {totalExpenses.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}</h3>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="total-box">
                                                        <h5>Total Income</h5>
                                                        <h3><i className="fa-solid fa-dollar-sign"></i> {totalIncomes.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="total-box">
                                                        <h5>Total Balance</h5>
                                                        <h3><i className="fa-solid fa-dollar-sign"></i> {totalBalance.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        { updateWalletModal && (
                            <UpdateWalletModal wallet={selectedWallet} updateWalletModal={updateWalletModal} toggleUpdateWalletModal={toggleUpdateWalletModal} />
                        )}

                        { deleteWalletModal && (
                            <DeleteWalletModal wallet={selectedWallet} toggleDeleteWalletModal={toggleDeleteWalletModal} />
                        )}
                    <ToastContainer/>
                </div>
            </div>
    );
};
