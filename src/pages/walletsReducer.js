import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import {collection, getDocs, query, where} from "firebase/firestore";
import {auth, db} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";

export const getWallets = createAsyncThunk('wallets/getWallets', async (userId) => {
    try {
        if(userId) {

            console.log("getWallets function called");
            const walletsRef =  collection(db, "wallets");
            const walletsDoc = userId ? query(walletsRef, where("userId","==", userId)) : null;
            const data = await getDocs(walletsDoc);
            const filteredData = data.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))

            return filteredData;
        }

    } catch (err) {
        console.error(err);
    }
});

const initialState = {
    walletsList: [],
};

const walletSlice = createSlice({
    name: 'wallets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWallets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWallets.fulfilled, (state, action) => {
                state.loading = false;
                state.walletsList = action.payload;
            })
            .addCase(getWallets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setWalletsList } = walletSlice.actions;
export default walletSlice.reducer;