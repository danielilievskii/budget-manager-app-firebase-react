import {Controller, useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";


import React, {useEffect, useState} from "react";
import {addDoc, collection, doc, query, where, updateDoc, Timestamp} from "firebase/firestore";
import {auth, db} from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from 'react-redux';
import {getWallets} from "../walletsReducer";
import {getRecords} from "../recordsReducer";

//Toast Notication
import 'react-toastify/dist/ReactToastify.css';
import {notifyRecordUpdate} from "../../components/toastUtils";

//Options
import {recordTypeOptions, categoryOptions, paymentTypeOptions} from "../../components/options";

import Select from "react-select";



export const UpdateRecordModal = (props) => {
    // console.log(props.record);
    const walletsRef =  collection(db, "wallets");
    const recordsRef =  collection(db, "records");
    const [user, loading] = useAuthState(auth);
    const userId = auth?.currentUser?.uid;
    const dispatch = useDispatch()

    const sortOrder = props.sortOrder;
    const recordsList = useSelector((state) => state.records.recordsList);
    const walletsList = useSelector((state) => state.wallets.walletsList);

    const [selectedType, setSelectedType] = useState(props.record.isExpense)

    useEffect(() => {
        console.log(props.record.walletId)
    }, [props])



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

    const {register, handleSubmit, control, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
    });


    const updateRecord = async (data) => {
        // console.log("Updating record with data:", data);
        try {
            const recordDoc = doc(db, "records", props.record.id);
            const { category, date, time, isExpense, ...rest } = data;


            const dateTimeString = `${date}T${time}:00`;
            const dateTime = new Date(dateTimeString);
            const timestamp = Timestamp.fromDate(dateTime);
            const newDateTime = timestamp.toDate();

            const isExpenseBool = data.isExpense.value === "Expense" ? true : false;

            //Updating wallet in case Record type, Wallet or Amount is changed
            const prevWalletDoc = doc(db, "wallets", props.record.walletId);
            const prevWallet = walletsList.find((wallet) => wallet.id === props.record.walletId);
            const currBalancePrevWallet = prevWallet.balance;

            const newWalletDoc = doc(db, "wallets", data.walletId.value);
            const newWallet = walletsList.find((wallet) => wallet.id === data.walletId.value);
            const currBalanceNewWallet = newWallet.balance;


            if(data.walletId.value !== props.record.walletId || isExpenseBool !== props.record.isExpense || data.amount !== props.record.amount) {
                //const newBalancePrevWallet = props.record.isExpense ?  (currBalancePrevWallet + props.record.amount) : (currBalancePrevWallet - props.record.amount)
                //let newBalancePrevWallet = props.record.isExpense ? data.amount !== props.record.amount ? (currBalancePrevWallet - (data.amount-props.record.amount)) : (currBalancePrevWallet + props.record.amount) : (currBalancePrevWallet - props.record.amount)
                let newBalancePrevWallet = 0, flag=0;
                if(props.record.isExpense === true) {
                    newBalancePrevWallet = currBalancePrevWallet + props.record.amount;
                    flag=1;
                }
                else if (props.record.isExpense === false) {
                    newBalancePrevWallet = currBalancePrevWallet - props.record.amount;
                    flag=1;
                }
                const resultUpdateOldWallet = await updateDoc(prevWalletDoc, {
                    balance: newBalancePrevWallet,
                });

                if(flag) {
                    let newBalanceNewWallet = 0;
                    if(isExpenseBool === true) {
                        if(data.walletId.value !== props.record.walletId) {
                            newBalanceNewWallet = currBalanceNewWallet - data.amount;
                        }
                        else if (data.walletId.value === props.record.walletId) {
                            newBalanceNewWallet = newBalancePrevWallet - data.amount;
                        }
                    }
                    else if (isExpenseBool === false) {
                        if(data.walletId.value !== props.record.walletId) {
                            newBalanceNewWallet = currBalanceNewWallet + data.amount;
                        }
                        else if (data.walletId.value === props.record.walletId) {
                            newBalanceNewWallet = newBalancePrevWallet + data.amount
                        }
                    }

                    const resultUpdateNewWallet = await updateDoc(newWalletDoc, {
                        balance: newBalanceNewWallet,
                    })
                }
            }

            const resultRecord = await updateDoc(recordDoc, {
                ...rest,
                category: data.category.value,
                dateTime: newDateTime,
                userId,

                //TO DO CALCULATIONS
                isExpense: isExpenseBool,
                amount: data.amount,
                walletId: data.walletId.value,
                walletName: data.walletId.label,
            });

            notifyRecordUpdate(data.place);
            props.toggleUpdateRecordModal();
            dispatch(getRecords({userId, sortOrder}));


        } catch (err) {
            console.error(err);
        }

    }

    // Assuming props.record.dateTime is a Unix timestamp
    const timestamp = props.record.dateTime;
    const dateObj = new Date(timestamp);

    // Get date and time components
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const defaultDate = `${year}-${month}-${day}`;

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const defaultTime = `${hours}:${minutes}`;


    return (
        <div>
            <div className={`overlay`}>
                <div className={`modal-wrap record-modal`}>
                    <div className="head-modal">
                        <h3>Update Transaction</h3>
                        <i className="fa-solid fa-x close-modal" onClick={() => {
                                props.toggleUpdateRecordModal();
                        }}></i>
                    </div>

                        <div className="modal-content">

                            <form onSubmit={handleSubmit(updateRecord)}>
                                <div className="row">
                                    <div className="col-md-5">

                                        <label>Transaction type:</label>
                                        <Controller
                                            name="isExpense"
                                            control={control}
                                            defaultValue={{
                                                value: props.record.isExpense ? "Expense" : "Income",
                                                label: props.record.isExpense ? "Expense" : "Income",
                                            }}
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
                                            defaultValue={{
                                                value: props.record.walletId,
                                                label: props.record.walletName,
                                            }}
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
                                        <input defaultValue={props.record.amount} {...register("amount")}/>
                                        <p style={{color: "red"}}>{errors.amount?.message}</p>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <label htmlFor="start">Date:</label>
                                                <input type="date" defaultValue={defaultDate} max={new Date().toLocaleDateString('en-CA')}
                                                       {...register("date")}/>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="start">Time:</label>
                                                <input type="time" defaultValue={defaultTime}
                                                       {...register("time")}/>
                                            </div>
                                            {/*{props.record.dateTime.toDate().toLocaleString()}*/}
                                        </div>
                                    </div>

                                    <div className="col-md-7">
                                        <label className="label" >Place:</label>
                                        <input type="text" defaultValue={props.record.place} {...register("place")}/>
                                        <p style={{color: "red"}}>{errors.place?.message}</p>

                                        <label className="label" >Note:</label>
                                        <textarea type="text" defaultValue={props.record.note} placeholder="Optional..." className="record-textarea" {...register("note")}/>

                                        <label className="label">Category:</label>
                                        <Controller
                                            name="category"
                                            control={control}
                                            defaultValue={{
                                                value: props.record.category,
                                                label: props.record.category,
                                            }}
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

        </div>

    )
}