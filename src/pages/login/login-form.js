//Firebase & Auth
import {signInWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth";
import {auth, db, googleProvider} from "../../config/firebase";
import {addDoc, collection, getDocs, query, where, doc, updateDoc} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";

//React stuff
import React from "react";
import {useNavigate} from "react-router-dom";
import {errorLogin} from "../../components/toastUtils";

//Validation
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
export const LoginForm = (props) => {

    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);

    const schema = yup.object().shape({
        emailLog: yup.string(),
        passwordLog: yup.string(),

    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const logIn = async (data) => {
        try {
            const loginResult = await signInWithEmailAndPassword(auth, data.emailLog, data.passwordLog);
            if(loginResult) {
                const usersCollectionRef = collection(db, "users");
                const userSnapshot = await getDocs(query(usersCollectionRef, where("userId", "==", auth.currentUser.uid)))
                const userDoc = userSnapshot.docs[0];
                const userDocRef = doc(db, "users", userDoc.id);

                try {
                    await updateDoc(userDocRef, {
                        lastActivityDate: new Date(),
                    });
                } catch (updateError) {
                    console.error("Error updating lastActivityDate:", updateError);
                }
            }
            navigate("/dashboard");
        } catch (err) {
            console.error(err)
            // errorLogin();
        }
    }
    const signInWithGoogle  = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result) {
                const { displayName, uid, email } = result.user;
                const querySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", email)));
                const existingUser = querySnapshot.docs[0];

                if (!existingUser) {
                    // If the user with the email doesn't exist, add them to the users collection
                    const result2 = await addDoc(collection(db, "users"), {
                        displayName: result.user.displayName,
                        userId: result.user.uid,
                        email: result.user.email,
                        emailVerified: result.user?.emailVerified,
                        isAdmin: false,
                        creationDate: new Date(),
                        lastActivityDate: new Date(),
                    });
                }

                if(existingUser) {
                    const user = auth.currentUser;
                    if (user) {
                        const usersCollectionRef = collection(db, "users");
                        const userSnapshot = await getDocs(query(usersCollectionRef, where("userId", "==", auth.currentUser.uid)))
                        const userDoc = userSnapshot.docs[0];
                        const userDocRef = doc(db, "users", userDoc.id);

                        try {
                            await updateDoc(userDocRef, {
                                lastActivityDate: new Date(),
                            });
                        } catch (updateError) {
                            console.error("Error updating lastActivityDate:", updateError);
                        }
                    } else {
                        console.error("No authenticated user found");
                    }
                }

                navigate("/dashboard");

            }
        }catch (err) {
            console.error(err)
        }
    }

    return (

        <form onSubmit={handleSubmit(logIn)} ref={props.loginFormRef}  className="login">
            <div className="field">
                <input type="text" placeholder="Email Address" {...register("emailLog")} />
                {/*<i className="fa-solid fa-at"></i>*/}
                <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="field">
                <input type="password" placeholder="Password" {...register("passwordLog")}/>
                <i className="fa-solid fa-lock"></i>
                {/*<i className="fa-solid fa-key"></i>*/}
            </div>

            <div className="pass-link"><a href="#">Forgot password?</a></div>
            <div className="field field-btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login"/>
            </div>

            <div className="or-thing">
                <span>or</span>
            </div>
            <div className="aligned">
                <button className="google-btn" onClick={signInWithGoogle}><img src="images/g-logo.png" width="20" height="20"/> Continue with Google</button>
            </div>

        </form>
    )
}
