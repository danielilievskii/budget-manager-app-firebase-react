//Auth & Firebase
import {auth, db} from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {collection, doc, updateDoc, getDocs, writeBatch} from "firebase/firestore";
import {getWallets} from "../walletsReducer";

//Validation
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {Controller, useForm} from "react-hook-form";

//React stuff
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";

//Toast Notication
import 'react-toastify/dist/ReactToastify.css';
import {notifyWalletUpdate} from "../../components/toastUtils";

//Options
import {walletTypeOptions} from "../../components/options";
export const UpdateWalletModal = (props) => {
    const [user, loading] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;
    const dispatch = useDispatch();

    const schema = yup.object().shape({
        name: yup.string().required("Please enter a wallet name."),
        type: yup.mixed(),
        balance: yup.number().typeError("Please enter a valid balance amount.").nullable(),
    });

    const {register, handleSubmit, control, formState: {errors}, setValue} = useForm({
        resolver: yupResolver(schema),
    });

    const updateWallet = async (data) => {
        try {
            const walletDoc = doc(db, "wallets", props.wallet.id);
            const result = await updateDoc(walletDoc, {
                name: data.name,
                type: data.type.value,
                balance: data.balance,
                userId
            });

            //Update all transactions with the new data.name
            const recordsSnapshot = await getDocs(collection(db, "records"));
            const recordsToUpdate = recordsSnapshot.docs.filter(
                (doc) => doc.data().walletId === props.wallet.id
            );

            const batch = writeBatch(db)
            recordsToUpdate.forEach((recordDoc) => {
                // const recordRef = recordDoc.ref;
                // console.log("Updating record with ID:", recordDoc.id);
                batch.update(recordDoc.ref, { walletName: data.name });
            });
            await batch.commit();

            notifyWalletUpdate(props.wallet.name);
            props.toggleUpdateWalletModal();
            dispatch(getWallets(userId));
            //dispatch(getRecords(userId));

        } catch (err) {
            console.error(err);
        }
    }


    return (
            <div className="overlay">
                    <div className="modal-wrap">
                        <div className="head-modal">
                            <h3>Update Wallet</h3>
                            <i className="fa-solid fa-x close-modal" onClick={() => {
                                props.toggleUpdateWalletModal();
                            }}></i>
                        </div>

                        <div className="modal-content">
                            <form onSubmit={handleSubmit(updateWallet)}>

                                <div className="row">
                                    <div className="col-md-6 add-wallet-input">
                                        <label className="label">Wallet name</label>
                                        <input type="text" defaultValue={props.wallet.name}  placeholder="Type..." {...register("name")} />
                                        <p style={{color: "red"}}>{errors.name?.message}</p>
                                    </div>
                                    <div className="col-md-6 add-wallet-input">
                                        <label className="label" >Balance (USD)</label>
                                        <input defaultValue={props.wallet.balance} placeholder="Type..." {...register("balance")}/>
                                        <p style={{color: "red"}}>{errors.balance?.message}</p>
                                    </div>
                                </div>

                                <label htmlFor="categorySelect" className="label">Wallet type</label>
                                <Controller
                                    name="type"
                                    defaultValue={{
                                        value: props.wallet.type,
                                        label: props.wallet.type,

                                    }}
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
                                    <button className="submit-btn"> Save </button>
                                </div>

                            </form>
                        </div>
                    </div>
            </div>
    )
}
