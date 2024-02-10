import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {auth, db} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";

export const getUsers = createAsyncThunk('users/getUsers', async ({userId, sortOrder}) => {
    try {
        if(userId) {

            console.log("getWallets function called");
            const usersRef =  collection(db, "users");
            //const walletsDoc = userId ? query(walletsRef, where("userId","==", userId)) : null;
            let usersDoc;

            if (sortOrder === "creationNewest") {
                usersDoc = query(usersRef,  orderBy("creationDate", "desc"));
            } else if (sortOrder === "creationOldest") {
                usersDoc = query(usersRef,  orderBy("creationDate", "asc"));
            } else if (sortOrder === "activityNewest") {
                usersDoc = query(usersRef,  orderBy("lastActivityDate", "desc"));
            } else if (sortOrder === "activityOldest") {
                usersDoc = query(usersRef,  orderBy("lastActivityDate", "asc"));
            } else {
                // Default sorting if sortOrder is not specified or invalid
                usersDoc =  orderBy("creationDate", "desc");
            }

            const data = await getDocs(usersDoc);
            const filteredData = data.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }))

            return filteredData;
        }

    } catch (err) {
        console.error(err);
    }
});

const initialState = {
    usersList: [],
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.usersList = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setUsersList } = userSlice.actions;
export default userSlice.reducer;