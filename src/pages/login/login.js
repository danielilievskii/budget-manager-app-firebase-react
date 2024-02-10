import React, {useRef, useEffect} from "react";
import {auth, db, googleProvider} from "../../config/firebase";
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import "./login.css"

import {SignUpForm} from "./signup-form";
import {LoginForm} from "./login-form";

//Toast Notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Login = () => {

    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);

    const loginTextRef = useRef(null);
    const signupTextRef = useRef(null);

    const loginFormRef = useRef(null);
    const signupFormRef = useRef(null);

    // const handleRegister = () => {
    //     handleSignup();
    //     //return false;
    // }

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    const handleSignup = () => {
        if (loginFormRef.current && loginTextRef.current && signupFormRef.current && signupTextRef.current) {
            loginFormRef.current.style.marginLeft = "-50%";
            loginTextRef.current.style.marginLeft = "-50%";

            signupFormRef.current.style.marginLeft = "0%";
            signupTextRef.current.style.marginLeft = "0%";
        }
    }

    const handleLogin = () => {
        if (signupFormRef.current && signupTextRef.current && loginFormRef.current && loginTextRef.current) {
            signupFormRef.current.style.marginRight = "-50%";
            signupTextRef.current.style.marginRight = "-50%";

            loginFormRef.current.style.marginLeft = "0%";
            loginTextRef.current.style.marginLeft = "0%";
        }
    }


    return (
        // <Loading/>
        <div className="landing-page">
            <div className="container">
                <div className="row content">
                    <div className="col-md-8 left">
                        <div className="left-content">
                            <img className="logo-landing" src="images/logo-removebg-preview.png" alt=""/>
                            <img className="promo" src="images/login-promo-banner.png" alt=""/>
                            <h1><i>Where your finances meet.</i></h1>
                        </div>
                    </div>
                    <div className="col-md-4 right">
                        <div className="right-content">

                            <div className="wrapper">
                                <div className="title-text">
                                    <div  ref={loginTextRef} className="title login">Login</div>
                                    <div ref={signupTextRef}  className="title signup">Sign Up</div>
                                </div>
                                <div className="form-container">
                                    <div className="slide-controls">
                                        <input type="radio" name="slide" id="login" />
                                        <input type="radio" name="slide" id="signup"/>
                                        <label htmlFor="login" className="slide login" onClick={handleLogin}>Login</label>
                                        <label htmlFor="signup" className="slide signup" onClick={handleSignup}>Sign Up</label>
                                        <div className="slider-tab"></div>
                                    </div>
                                    <div className="form-inner">
                                        <LoginForm  loginFormRef={loginFormRef}  />
                                        <SignUpForm signupFormRef={signupFormRef} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>

    );
}
