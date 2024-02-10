import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { initializeApp } from 'firebase/app';
import { auth, db } from './config/firebase';
import {firebaseConfig} from "./config/firebase";
import {getFirestore} from "firebase/firestore";

// Initialize Firebase


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

