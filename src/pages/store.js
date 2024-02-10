import { configureStore, createSlice } from '@reduxjs/toolkit';
import walletReducer from './walletsReducer';
import recordsReducer from './recordsReducer';
import usersReducer from "./usersReducer";


const store = configureStore({
    reducer: {
        wallets: walletReducer,
        records: recordsReducer,
        users: usersReducer,
    },
});

export default store;