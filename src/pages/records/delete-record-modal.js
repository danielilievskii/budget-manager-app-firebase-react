import { useForm } from "react-hook-form";

import {yupResolver} from "@hookform/resolvers/yup";



import React, {useState} from "react";
import {addDoc, collection, doc, query, where, updateDoc, getDocs, writeBatch, deleteDoc, runTransaction} from "firebase/firestore";
import {auth, db} from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from 'react-redux';
import {getWallets} from "../walletsReducer";

//Toast Notication
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from "yup";

import {notifyRecordDelete, notifyWalletDelete} from "../../components/toastUtils";
import {getRecords} from "../recordsReducer";


export const DeleteRecordModal = (props) => {
    const { sortOrder} = props;
    const [user, loading] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;
    const dispatch = useDispatch()

    const recordsList = useSelector((state) => state.records.recordsList);
    const walletsList = useSelector((state) => state.wallets.walletsList);

    // const updateWalletBalance =  async () => {
    //     const selectedWallet = walletsList.find((wallet) => wallet.id === props.record.walletId);
    //     const currentBalance = selectedWallet?.balance;
    //     const newBalance = props.record.isExpense ? (currentBalance + props.record.amount) : (currentBalance-props.record.amount);
    //
    //     const walletDoc = doc(db, "wallets", props.record.walletId);
    //     await updateDoc(walletDoc, {balance: newBalance});
    // }

    const deleteRecord = async ()=> {
        try {


            // Update the wallet balance
            const selectedWallet = walletsList.find((wallet) => wallet.id === props.record.walletId);
            const currentBalance = selectedWallet?.balance;
            const newBalance = props.record.isExpense ? (currentBalance + props.record.amount) : (currentBalance-props.record.amount);

            const walletDoc = doc(db, "wallets", props.record.walletId);
            //await updateDoc(walletDoc, {balance: newBalance});

            // Delete the record document
            const recordDoc = doc(db, "records", props.record.id);
            //await deleteDoc(recordDoc);

            await runTransaction(db, async (transaction) => {
                const walletSnapshot = await transaction.get(walletDoc);
                const walletData = walletSnapshot.data();
                transaction.update(walletDoc, { balance: newBalance });
                transaction.delete(recordDoc);
            });


            notifyRecordDelete(props.record.place);
            props.toggleDeleteRecordModal();
            dispatch(getRecords({userId, sortOrder}));
            dispatch(getWallets(userId));
        } catch (error) {
            console.error("Error deleting record: ", error)
        }
    }


    return (
        <div>
            <div className="overlay">
                <div className="modal-wrap" style={{backgroundColor: "white"}}>
                    <div className="modal-delete-content">

                        <div className="row modal-delete-content-inside">
                            <div className="col-md-1" ><i className="fa-regular fa-circle-xmark x-icon" ></i></div>
                            <div className="col-md-11 modal-delete-text">
                                <h4>Are you sure?</h4>
                                <p>Do you really want to delete this record? This process cannot be undone.</p>
                            </div>
                        </div>

                        <div className="modal-delete-buttons">
                            <button className="cancel-btn"  onClick={props.toggleDeleteRecordModal}>Cancel</button>
                            <button className="delete-btn"  onClick={deleteRecord}> Delete </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}
