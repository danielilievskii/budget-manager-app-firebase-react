import React, {useState} from "react";
import "./modal.css";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../config/firebase";
export const Modal = () => {
    const [modal, setModal] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toggleModal = () => {
        setModal(!modal);
    };

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            //navigate("/dashboard");
        } catch (err) {
            console.error(err)
        }
    }

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <div>
            <button onClick={toggleModal} className="btn-modal">OPEN</button>
            {modal && (
                <div className="overlay">
                    <div className="modal-content">
                        <div className="modal-content">
                            <div className="registerForm" id="registerForm">
                                <div className="row">
                                    <label className="label">Full Name:</label>
                                    <input type="text" placeholder="Full Name..." onChange={e => setFullName(e.target.value)}/>
                                </div>
                                <div className="row">
                                    <label className="label">Email:</label>
                                    <input type="email" placeholder="Email..." onChange={e => setEmail(e.target.value)}/>
                                </div>
                                <div className="row">
                                    <label className="label">Password</label>
                                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                                </div>
                                <div className="row">
                                    <label className="label">Confirm:</label>
                                    <input type="password" placeholder="Confirm Password" onChange={e => setPassword(e.target.value)}/>
                                </div>
                                <div className="row">
                                    <button onClick={signIn}>Register</button>
                                </div>
                            </div>
                            <button className="close-modal" onClick={toggleModal}>X</button>
                        </div>
                    </div>
                </div>
                // <div className="modal">
                //     <div className="overlay">

                //     </div>
                // </div>
            )}


            {/*<div className="custom-modal">*/}
            {/*    <button id="close-modal" onClick={closeModal}>X</button>*/}

            {/*</div>*/}
        </div>

    )
}