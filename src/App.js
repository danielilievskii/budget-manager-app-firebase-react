//Css
import './App.css';

//React stuff
import React, {useState} from "react";
import {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Provider, useDispatch} from 'react-redux';

//Components
import { Login } from "./pages/login/login";
import { Navbar } from "./components/navbar";
import {Dashboard} from "./pages/dashboard/dashboard";
import {Records} from "./pages/records/records";
import {Analytics} from "./pages/analytics/analytics";
import {Loading} from "./components/loading";
import {AdminPanel} from "./pages/admin-panel/admin-panel";
import {ErrorPage} from "./components/error-page";

//Auth & Firebase
import store from './pages/store';
import {auth} from "./config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {getRecords} from "./pages/recordsReducer";
import {getWallets} from "./pages/walletsReducer";

function App() {
    const [user, loading, loadingUser] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;

    const [loadingTimeout, setLoading] = useState(true);
    useEffect(() => {

        const loadingTimeout = setTimeout(() => {
            setLoading(false);
            }, 3000);
        // Clean up the timeout on unmount or if user data is retrieved
        return () => clearTimeout(loadingTimeout);
     }, );

    return (
    <div className="App">
        <Provider store={store}>
            <Router>
                {(user) && <Navbar/>}
                <Routes>
                    <Route path="/" element={<Login />}/>
                    {user && <Route path="/dashboard" element={<Dashboard/>}/>}
                    {user && <Route path="/records" element={<Records />}/>}
                    {user && <Route path="/analytics" element={<Analytics />}/>}
                    {user && <Route path="/admin-panel" element={<AdminPanel />}/>}
                    {(!loading) && <Route path="*" element={<ErrorPage/>}/>}
                </Routes>
            </Router>
        </Provider>

        {(loadingTimeout
            && (window.location.pathname === "/dashboard"
            || window.location.pathname === "/records"
            || window.location.pathname === "/analytics"
            || window.location.pathname === "/admin-panel")
            && user) && <Loading />}
    </div>
  );
}

export default App;
