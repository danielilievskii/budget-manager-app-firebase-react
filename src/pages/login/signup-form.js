import React from "react";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../config/firebase";
import {addDoc, collection} from "firebase/firestore";
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";

export const SignUpForm = (props) => {

    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const usersRef = collection(db, "users");

    const schema = yup.object().shape({
        usernameReg: yup.string().required("Username is required."),
        emailReg: yup.string().required("Email is required.").email("Email is not valid."),
        passwordReg: yup.string().min(6, "Password must be at least 6 characters.").required("Password is required."),
        confirmPasswordReg: yup.string().oneOf([yup.ref("passwordReg")], "Passwords are not same").required("Confirm your password."),
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const signIn = async (data) => {
        try {
            const authResult = await createUserWithEmailAndPassword(auth, data.emailReg, data.passwordReg);
            if (authResult) {
                const collectionResult = await addDoc(usersRef, {
                    displayName: data.usernameReg,
                    userId: authResult.user?.uid,
                    email: authResult.user?.email,
                    emailVerified: authResult.user?.emailVerified,
                    isAdmin: false,
                    creationDate: new Date(),
                    lastActivityDate: new Date(),
                });
            }
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };


    return (

        <form onSubmit={handleSubmit(signIn)} ref={props.signupFormRef} className="signup">
            <div className="field">
                <input type="text" placeholder="Username" {...register("usernameReg")}/>
                <i className="fa-solid fa-user"></i>
                <p className="error-message" >{errors.usernameReg?.message}</p>
            </div>
            <div className="field">
                <input type="text" placeholder="Email Address" {...register("emailReg")}/>
                <i className="fa-solid fa-envelope"></i>
                <p className="error-message" >{errors.emailReg?.message}</p>
            </div>
            <div className="field">
                <input type="password" placeholder="Password" {...register("passwordReg")}/>
                {/*<i className="fa-solid fa-key"></i>*/}
                <i className="fa-solid fa-lock"></i>
                <p className="error-message" >{errors.passwordReg?.message}</p>
            </div>
            <div className="field">
                <input type="password" placeholder="Confirm password" {...register("confirmPasswordReg")}/>
                {/*<i className="fa-solid fa-key"></i>*/}
                <i className="fa-solid fa-lock"></i>
                <p className="error-message" >{errors.confirmPasswordReg?.message}</p>
            </div>
            <div className="field field-btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Register"/>
            </div>
        </form>
    )
}
