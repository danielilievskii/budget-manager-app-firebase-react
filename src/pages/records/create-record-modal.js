//Auth & Firebase
import {addDoc, collection, Timestamp, updateDoc, doc, getDoc, serverTimestamp} from "firebase/firestore";
import {auth, db, } from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {getWallets} from "../walletsReducer";
import {getRecords} from "../recordsReducer";

//Form Validator
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

//React stuff
import { useDispatch, useSelector } from 'react-redux';
import React, {useState} from "react";


//Toast Notication
import 'react-toastify/dist/ReactToastify.css';
import {notifyRecordAdd} from "../../components/toastUtils";

//Options
import {recordTypeOptions, categoryOptions, paymentTypeOptions} from "../../components/options";

import Select from 'react-select';

export const RecordModal = (props) => {
    const { sortOrder} = props;
    const recordsRef =  collection(db, "records");

    const [user, loading] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;

    const dispatch = useDispatch();
    const walletsList = useSelector((state) => state.wallets.walletsList);

    //ADD WALLET MODAL
    const [recordModal, setRecordModal] = useState(false);

    const toggleRecordModal = () => {
        setRecordModal(!recordModal);
    }

    const schema = yup.object().shape({
        amount: yup.number().typeError("Please enter a valid amount.").nullable(),
        category: yup.mixed().required("Select category"),
        isExpense: yup.mixed().required("Select record type"),
        walletId: yup.mixed().required("Select wallet"),
        place: yup.string().required("Enter the place")
    });

    const {register, handleSubmit, setValue, control, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });


    const createRecord = async (data) => {
        try {
            // Get the date and time values from the form data
            const { category, date, time, isExpense, walletId, amount, paymentType, ...rest } = data;

            const dateTimeString = `${date}T${time}`;
            const dateTime = new Date(dateTimeString);
            const timestamp = Timestamp.fromDate(dateTime);
            const newDateTime = timestamp.toDate();

            //Convert the "isExpense" option to a boolean
            const isExpenseBool = isExpense.value === "Expense" ? true : false;


            // Add record document
            const result = await addDoc(recordsRef, {
                ...rest,
                userId,
                amount,
                walletId: walletId.value,
                walletName: walletId.label,
                isExpense: isExpenseBool,
                dateTime: newDateTime,
                category: category.value
            });

            if (result) {
                notifyRecordAdd(data.place);
                toggleRecordModal();
                dispatch(getRecords({userId, sortOrder}));
                dispatch(getWallets(userId))
            }

            // Update the wallet balance
            const selectedWallet = walletsList.find((wallet) => wallet.id === walletId.value);
            const currentBalance = selectedWallet.balance;
            const newBalance = isExpenseBool ? (currentBalance - amount) : (currentBalance+amount);

            const walletDoc = doc(db, "wallets", walletId.value);
            await updateDoc(walletDoc, {balance: newBalance});

        } catch (err) {
            console.error(err);
        }
    }

    //Current time for time input
    const currentHour = new Date().getHours().toString().padStart(2, '0'); // Get current hour in two-digit format
    const currentMinute = new Date().getMinutes().toString().padStart(2, '0'); // Get current minute in two-digit format
    const currentTime = `${currentHour}:${currentMinute}`;

    return (
        <div>
            <button className="add-wallet item-btn" onClick={toggleRecordModal}> + Add Transaction</button>
            {recordModal && (
                <div className="overlay">
                    <div className="modal-wrap record-modal">
                        <div className="head-modal">
                            <h3>Add Transaction</h3>
                            <i className="fa-solid fa-x close-modal" onClick={() => {
                                toggleRecordModal();
                            }}></i>
                        </div>

                        <div className="modal-content">

                            <form onSubmit={handleSubmit(createRecord)}>
                            <div className="row">
                                <div className="col-md-5">

                                        <label>Transaction type:</label>
                                        <Controller
                                            name="isExpense"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={recordTypeOptions}
                                                />
                                            )}
                                        />
                                        <p style={{color: "red"}}>{errors.isExpense?.message}</p>


                                        <label className="label">Wallet:</label>
                                        <Controller
                                            name="walletId"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={[
                                                        ...walletsList.map(wallet => ({ value: wallet.id, label: wallet.name }))
                                                    ]}
                                                />
                                            )}
                                        />
                                        <p style={{color: "red"}}>{errors.walletId?.message}</p>

                                        <label className="label" >Amount (USD)</label>
                                        <input {...register("amount")}/>
                                        <p style={{color: "red"}}>{errors.amount?.message}</p>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <label htmlFor="start">Date:</label>
                                            <input type="date" defaultValue={new Date().toLocaleDateString('en-CA')} max={new Date().toLocaleDateString('en-CA')}
                                                   {...register("date")}/>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="start">Time:</label>
                                            <input type="time" defaultValue={currentTime}
                                                   {...register("time")}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-7">
                                    <label className="label" >Place:</label>
                                    <input type="text" {...register("place")}/>
                                    <p style={{color: "red"}}>{errors.place?.message}</p>

                                    <label className="label" >Note:</label>
                                    <textarea type="text" placeholder="Optional..." className="record-textarea" {...register("note")}/>

                                    <label className="label">Category:</label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <Select className="category-select-dropdown"
                                                    {...field}
                                                    options={categoryOptions}
                                            />
                                        )}
                                    />
                                    <p style={{color: "red"}}>{errors.category?.message}</p>

                                </div>
                            </div>

                                <div className="aligned">
                                    <button className="submit-btn"> Submit </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};