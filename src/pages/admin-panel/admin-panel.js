
//Auth & Firebase
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../config/firebase";
import {collection, doc, getDocs, query, where, updateDoc, writeBatch} from "firebase/firestore";
import {getUsers} from "../usersReducer";

//React stuff
import {useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import React, {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import Select from "react-select";

//Components
import {DataInitialization} from "../../components/data-initialization";

//Css
import "./admin-panel.css"

//Options
import {categories, userSortOptions} from "../../components/options";

//Toast Notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {notifyAccountDelete, notifyAdminRole, notifyBudgeteerRole, notifyDataReset} from "../../components/toastUtils";

export const AdminPanel = () => {

    const [user, loading, loadingUser] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const usersList = useSelector((state) => state.users.usersList);
    const isLoading = useSelector((state) => state.users.loading)

    const [pageNumber, setPageNumber] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    //Order
    const [sortOrder, setSortOrder] = useState("creationNewest");


    useEffect(() => {
        //Filtering users after search
        const filteredList = usersList ? usersList.filter(user =>
            user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];
        setFilteredUsers(filteredList);
    }, [searchTerm, usersList, loading]);


    useEffect(() => {
        //Fetching users
        if(userId) {
            dispatch(getUsers({userId, sortOrder}));
        }
    }, [dispatch, user, sortOrder, loading]);

    const MakeAdmin = async (user) => {
        try {
            const usersCollectionRef = collection(db, "users");
            const userSnapshot = await getDocs(query(usersCollectionRef, where("userId", "==", user.userId)))
            const userDoc = userSnapshot.docs[0];
            const userDocRef = doc(db, "users", userDoc.id);
            try {
                await updateDoc(userDocRef, {
                    isAdmin: true,
                })
            } catch (updateError) {
                console.error("Error updating isAdmin:", updateError);
            }
            notifyAdminRole(user.displayName)
            dispatch(getUsers({userId, sortOrder}));
        } catch (err) {
            console.error(err)
        }
    }

    const RemoveAdmin = async (user) => {
        try {
            const usersCollectionRef = collection(db, "users");
            const userSnapshot = await getDocs(query(usersCollectionRef, where("userId", "==", user.userId)))
            const userDoc = userSnapshot.docs[0];
            const userDocRef = doc(db, "users", userDoc.id);
            try {
                await updateDoc(userDocRef, {
                    isAdmin: false,
                })
            } catch (updateError) {
                console.error("Error updating isAdmin:", updateError);
            }
            notifyBudgeteerRole(user.displayName);
            dispatch(getUsers({userId, sortOrder}));
        } catch (err) {
            console.error(err)
        }
    }

    const resetAccount = async (user) => {
        const batch = writeBatch(db);

        //Delete all records
        const recordsSnapshot = await getDocs(collection(db, "records"));
        const recordsToDelete = recordsSnapshot.docs.filter(
            (doc) => doc.data().userId === user.userId
        );

        const walletsSnapshot = await getDocs(collection(db, "wallets"));
        const walletsToDelete = walletsSnapshot.docs.filter(
            (doc) => doc.data().userId === user.userId
        );

        recordsToDelete.forEach((recordDoc) => {
            batch.delete(recordDoc.ref);
        });

        walletsToDelete.forEach((walletDoc) => {
            batch.delete(walletDoc.ref);
        });
        await batch.commit();

        notifyDataReset(user.displayName);
        dispatch(getUsers({userId, sortOrder}));


    }
    const deleteAccount = async (user) => {

        const batch = writeBatch(db);
        await resetAccount(user);

        const usersSnapshot = await getDocs(collection(db, "users"));
        const userToDelete = usersSnapshot.docs.filter(
            (doc) => doc.data().userId === user.userId
        );
        userToDelete.forEach((userDoc) => {
            batch.delete(userDoc.ref);
        });
        await batch.commit();
        dispatch(getUsers({userId, sortOrder}));
        notifyAccountDelete(user.displayName);

    }

    //UNUSED
    // if (isLoading) {
    //     return (
    //         <DataInitialization/>
    //     )
    // }

    const recordsPerPage = 7;
    const pagesVisited = pageNumber * recordsPerPage;
    const totalRecords = usersList ? usersList.length : 0;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);


    return (
        <div className="main-content">
            <div className="admin-panel-wrap">
                <div className="container">
                    <div className="head-admin-panel-box">
                            <div className="row">
                                <div className="col-md-6">
                                    <h2 className="blue-colored">Admin panel</h2>
                                </div>
                                <div className="col-md-6">
                                    <div className="head-admin-panel-box-items">
                                        <div className="sort-section item">
                                            <Select
                                                defaultValue={{value: "creationNewest", label: "Account Created (newest)"}}
                                                value={sortOrder.value}
                                                onChange ={option => setSortOrder(option.value)}
                                                options = {userSortOptions}
                                                className="sort-range sort"
                                            />
                                        </div>
                                        <div className="search-container item">
                                            <i className="fa-solid fa-magnifying-glass blue-colored"></i>
                                            <input
                                                className="search-input"
                                                type="text"
                                                placeholder="Search user..."
                                                value={searchTerm}
                                                onChange={event => setSearchTerm(event.target.value)}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                    </div>

                    <div className="admin-panel-table-box">
                        <table className="admin-panel-table">
                            <thead>
                            <tr>
                                <th>Username</th>
                                <th >Email</th>
                                <th>Verified</th>
                                <th>Role</th>
                                <th>User ID</th>
                                <th>Account Created</th>
                                <th>Last activity</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersList && filteredUsers.slice(pagesVisited, pagesVisited + recordsPerPage).map(user => {

                                return (
                                    <tr>
                                        <td>{user.displayName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.emailVerified ? "Yes" : "No"}</td>
                                        <td>{user.isAdmin ? "Admin" : "Budgeteer"}</td>
                                        <td>{user.userId}</td>
                                        <td>
                                            {user.creationDate ? (
                                                <div>
                                                    {user.creationDate.toDate().toLocaleDateString()}
                                                    <br />
                                                    {user.creationDate.toDate().toLocaleTimeString()}
                                                </div>
                                            ) : "N/A"}
                                        </td>
                                        <td>
                                            {user.lastActivityDate ? (
                                                <div>
                                                    {user.lastActivityDate.toDate().toLocaleDateString()}
                                                    <br />
                                                    {user.lastActivityDate.toDate().toLocaleTimeString()}
                                                </div>
                                            ) : "N/A"}
                                        </td>
                                        <td>

                                                {user.isAdmin ?
                                                    <button onClick={() => RemoveAdmin(user)} className="admin-btn"><i
                                                        className="fa-solid fa-user-minus"></i></button>
                                                    :
                                                    <button onClick={() => MakeAdmin(user)} className="admin-btn"><i
                                                        className="fa-solid fa-user-plus"></i></button>
                                                }


                                                <button onClick={() => resetAccount(user)}
                                                        className="delete-account-btn"><i
                                                    className="fa-solid fa-arrows-rotate"></i>
                                                </button>
                                                <button onClick={() => deleteAccount(user)} className="delete-account-btn"><i
                                                    className="fa-solid fa-trash trash-delete-btn"></i>
                                                </button>

                                        </td>
                                    </tr>
                                )

                            })}
                            </tbody>
                        </table>

                    </div>
                    <div className="pagination-box">
                        <ReactPaginate
                            previousLabel={<span><i className="fa-solid fa-angle-left"></i> Previous</span>}
                            nextLabel={<span>Next <i className="fa-solid fa-angle-right"></i></span>}
                            pageCount={totalPages}
                            onPageChange={({ selected }) => setPageNumber(selected)}
                            containerClassName={"pagination"}
                            previousLinkClassName={"pagination-link"}
                            nextLinkClassName={"pagination-link"}
                            disabledClassName={"pagination-disabled"}
                            activeClassName={"pagination-active"}
                        />
                    </div>
                </div>
            </div>

            <ToastContainer/>
        </div>
    )
}
