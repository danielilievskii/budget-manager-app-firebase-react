import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import {collection, getDocs, query, where, orderBy} from "firebase/firestore";
import {auth, db} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";

export const getRecords = createAsyncThunk('records/getRecords', async ({userId, sortOrder}) => {
    try {
        if(userId) {
            const recordsRef =  collection(db, "records");
            let recordsDoc;

            if (sortOrder === "newest") {
                recordsDoc = query(recordsRef, where("userId", "==", userId), orderBy("dateTime", "desc"));
            } else if (sortOrder === "oldest") {
                recordsDoc = query(recordsRef, where("userId", "==", userId), orderBy("dateTime", "asc"));
            } else if (sortOrder === "highest") {
                recordsDoc = query(recordsRef, where("userId", "==", userId), orderBy("amount", "desc"));
            } else if (sortOrder === "lowest") {
                recordsDoc = query(recordsRef, where("userId", "==", userId), orderBy("amount", "asc"));
            } else {
                // Default sorting if sortOrder is not specified or invalid
                recordsDoc = query(recordsRef, where("userId", "==", userId), orderBy("dateTime", "desc"));
            }
            const data = await getDocs(recordsDoc);
            const filteredData = data.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                dateTime: doc.data().dateTime.toDate().toLocaleDateString()
            }))

            return filteredData;
        }

    } catch (err) {
        console.error(err);
    }
});

const initialState = {
    recordsList: [],
};

const recordSlice = createSlice({
    name: 'records',
    initialState,
    reducers: {
        setRecordsList: (state, action) => {
            state.recordsList = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRecords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecords.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // Reset the error in case of success
                state.recordsList = action.payload;
            })
            .addCase(getRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setRecordsList } = recordSlice.actions;
export default recordSlice.reducer;