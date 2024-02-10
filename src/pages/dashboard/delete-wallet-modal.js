//Auth & Firebase
import {auth, db} from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {collection, doc, getDocs, writeBatch, deleteDoc} from "firebase/firestore";
import {getWallets} from "../walletsReducer";

//React stuff
import React, {useState} from "react";
import { useDispatch, useSelector } from 'react-redux';


//Toast Notication
import 'react-toastify/dist/ReactToastify.css';
import {notifyWalletDelete} from "../../components/toastUtils";


export const DeleteWalletModal = (props) => {
    const [user, loading] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;
    const dispatch = useDispatch()

    const deleteWallet = async () => {

        try {
            // Delete all records associated with the wallet ID
            const recordsSnapshot = await getDocs(collection(db, "records"));
            const recordsToDelete = recordsSnapshot.docs.filter(
                (doc) => doc.data().walletId === props.wallet.id
            );
            const batch = writeBatch(db);
            recordsToDelete.forEach((recordDoc) => {
                batch.delete(recordDoc.ref);
            });
            await batch.commit();

            // Delete the wallet document
            const walletDoc = doc(db, "wallets", props.wallet.id);
            const result = deleteDoc(walletDoc);
            if (result) {
                notifyWalletDelete(props.wallet.name);
                props.toggleDeleteWalletModal();
                dispatch(getWallets(userId));
            }

        } catch (error) {
            console.error("Error deleting wallet:", error);
        }
    };


    return (
        <div>
            <div className="overlay">
                <div className="modal-wrap" style={{backgroundColor: "white"}}>
                    <div className="modal-delete-content">
                        <div className="row modal-delete-content-inside">
                            <div className="col-md-1" ><i className="fa-regular fa-circle-xmark x-icon" ></i></div>
                            <div className="col-md-11 modal-delete-text">
                                <h4>Are you sure?</h4>
                                <p>Do you really want to delete this wallet? This process cannot be undone.</p>
                            </div>
                        </div>
                        <div className="deletemodal-actions">
                            <button className="cancel-btn"  onClick={props.toggleDeleteWalletModal}>Cancel</button>
                            <button className="delete-btn"  onClick={deleteWallet}> Delete </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
