//Auth & Firebase
import {auth, db} from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";

//React stuff
import {useEffect, useState} from "react";
import {NavLink, Link, useNavigate} from "react-router-dom"

//Css
import "./navbar.css"

export const Navbar = () => {

    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [displayName, setDisplayName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    console.log(auth?.currentUser?.uid);
    console.log(displayName);

    const signUserOut = async () => {
        await signOut(auth);
        navigate("/")
    };

    useEffect(() => {
        const fetchDisplayName = async () => {
            if(!loading && user) {
                try{
                    const userid = auth?.currentUser?.uid;
                    const usersRef =  collection(db, "users");
                    const userDocQuery =  query(usersRef, where("userId", "==", userid))
                    const userDocSnapshot = await getDocs(userDocQuery);

                    if(!userDocSnapshot.empty) {
                        const userData = userDocSnapshot.docs[0].data();
                        setDisplayName(userData.displayName);
                        setIsAdmin(userData.isAdmin);
                        return displayName;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        fetchDisplayName();

    }, [user])


    //console.log(displayName);
    return (

        <div className="navbar">
            <div className="navbar-container">
                <div className="logo-container aligned">
                    <Link to="/dashboard" className="logo"></Link>
                </div>


                <div className="user">
                    <div className="user-pic">
                        {user && (
                            <>
                                {user.photoURL ?
                                    <img src={user?.photoURL || ""} width="50" height="50"/> :
                                    <img src="/images/user.png" width="50" height="50"/>
                                }
                            </>
                        )}
                    </div>
                    <div className="user-info">
                        <p>{displayName}</p>
                        {/*<p>Daniel Ilievski</p>*/}
                        <p className="user-type" style={{opacity: "0.5"}}>{isAdmin ? "Admin" : "Budgeteer"}</p>
                    </div>
                </div>


                <div className="links">

                    {user && <NavLink className="link" to="/dashboard">
                        <i className="fa-solid fa-house"></i>
                        {/*<i className="fas fa-display"></i> */}
                        <span>Dashboard</span>
                    </NavLink> }
                    {user && <NavLink className="link" to="/records">
                        <i className="fa-solid fa-rectangle-list"></i> Transactions
                    </NavLink>}
                    {user && <NavLink className="link" to="/analytics">
                        {/*<i className="fa-solid fa-chart-simple"></i>*/}
                        <i className="fas fa-chart-line"></i> <span>Analytics</span>
                    </NavLink>}
                    {(user && isAdmin === true) && <NavLink className="link" to="/admin-panel">
                        {/*<i className="fa-solid fa-chart-simple"></i>*/}
                        <i className="fas fa-user-cog"></i> <span>Admin Panel</span>
                    </NavLink>}
                </div>
            </div>

            <div className="logout-container aligned">
                <button className="logout-btn" onClick={signUserOut}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
            </div>

        </div>
    );
};
