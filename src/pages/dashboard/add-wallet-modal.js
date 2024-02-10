//Auth & Firebase
import {auth, db} from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {addDoc, collection, query, where} from "firebase/firestore";

//Validation
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";

//React stuff
import React, {useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";

import {getWallets} from "../walletsReducer";

//Toast Notication
import 'react-toastify/dist/ReactToastify.css';
import {notifyWalletAdd, warnWalletAdd} from "../../components/toastUtils";

//Options
import {walletTypeOptions} from "../../components/options";

export const AddWalletModal = () => {
    const walletsRef =  collection(db, "wallets");
    const [user, loading] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;
    const dispatch = useDispatch()

    //ADD WALLET MODAL
    const [walletModal, setWalletModal] = useState(false);
    const toggleWalletModal = () => {
        setWalletModal(!walletModal);
    }

    const schema = yup.object().shape({
        name: yup.string().required("Please enter a wallet name."),
        balance: yup.number().typeError("Please enter a valid balance amount.").nullable(),
        type: yup.mixed().required("Please choose your wallet type."),
    });

    const {register, handleSubmit, control, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });

    const createWallet = async (data) => {
        try {
            const {type, ...rest} = data

            const result = await addDoc(walletsRef, {
                ...rest,
                type: type.value,
                userId
            })
            if (result) {
                notifyWalletAdd(data.name);
                toggleWalletModal();
                dispatch(getWallets(userId));
            }
        } catch (err) {
            console.error(err);
            warnWalletAdd();
        }
    }

    return (
        <div className="head-component">
            <button className="add-wallet" onClick={toggleWalletModal}> + Add Wallet</button>
            {walletModal && (
                <div className={`overlay `}>
                    <div className={`modal-wrap`}>
                        <div className="head-modal">
                            <h3>Add Wallet</h3>
                            <i className="fa-solid fa-x close-modal" onClick={toggleWalletModal}></i>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleSubmit(createWallet)}>
                                <div className="row">
                                    <div className="col-md-6 add-wallet-input">
                                        <label className="label">Wallet name</label>
                                        <input type="text"   {...register("name")}/>
                                        <p style={{color: "red"}}>{errors.name?.message}</p>
                                    </div>
                                    <div className="col-md-6 add-wallet-input">
                                        <label className="label" >Balance (USD)</label>
                                        <input  {...register("balance")}/>
                                        <p style={{color: "red"}}>{errors.balance?.message}</p>
                                    </div>
                                </div>

                                <label htmlFor="categorySelect" className="label">Wallet type</label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            {...field}
                                            options={walletTypeOptions}
                                        />
                                    )}
                                />
                                <p style={{color: "red"}}>{errors.type?.message}</p>


                                <div className="aligned">
                                    <button className="submit-btn"> Submit </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            )}
        </div>

    )
}