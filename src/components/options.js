import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faShoppingCart, faHome, faCar, faBus, faBook, faCity, faHandHoldingUsd, faBars, faNotesMedical, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import React, {useState} from "react";
import {Loading} from "./loading";


// Wallet Options
export const walletTypeOptions = [
    { value: 'General', label: 'General'},
    { value: 'Cash', label: 'Cash'},
    { value: 'Credit Card', label: 'Credit Card'},
    { value: 'Digital', label: 'Digital'},
    { value: 'Crypto', label: 'Crypto'},
]

// Record Options
export const recordTypeOptions = [
    { value: "Expense", label: "Expense"},
    { value: "Income", label: "Income"},
]

export const categoryOptions = [
    { value: 'Food & Drinks', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faUtensils} /> <span> Food & Drinks</span> </div>
        )},
    { value: 'Shopping', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faShoppingCart} /> <span> Shopping</span> </div>
        )},
    { value: 'Housing', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faHome} /> <span> Housing</span> </div>
        )},
    { value: 'Travel', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faPlaneDeparture} /> <span> Travel</span> </div>
        )},
    { value: 'Transportation', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faBus} /> <span> Transportation</span> </div>
        )},
    { value: 'Health & Wellness', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faNotesMedical} /> <span> Health & Wellness</span> </div>
        )},
    { value: 'Education', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faBook} /> <span> Education</span> </div>
        )},
    { value: 'Vehicle', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faCar} /> <span> Vehicle</span> </div>
        )},
    { value: 'Life & Entertainment', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faCity} /> <span> Life & Entertainment</span> </div>
        )},
    { value: 'Investments', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faHandHoldingUsd} /> <span> Investments</span> </div>
        )},
    { value: 'Others', label: (
            <div className="category-option"> <FontAwesomeIcon icon={faBars} /> <span> Others</span> </div>
        )},

];

export const getIconClassForCategory = (category) => {
    switch (category) {
        case 'Food & Drinks':
            return 'fa-utensils';
        case 'Shopping':
            return 'fa-shopping-cart';
        case 'Housing':
            return 'fa-home';
        case 'Transportation':
            return 'fa-bus';
        case 'Travel':
            return 'fa-plane-departure';
        case 'Health & Wellness':
            return 'fa-notes-medical'
        case 'Education':
            return 'fa-book'
        case 'Vehicle':
            return 'fa-car';
        case 'Life & Entertainment':
            return 'fa-city'
        case 'Investments':
            return 'fa-hand-holding-usd'

        case 'Others':
            return 'fa-bars'
        default:
            return 'fa-question'; // Default icon in case category is not recognized
    }
};
export const categories = ["Food & Drinks", "Shopping", "Housing", "Transportation", "Travel", "Health & Wellness", "Education", "Vehicle", "Life & Entertainment", "Investments", "Others"]; // Add more categories

export const paymentTypeOptions = [
    {value: "Cash", label: "Cash"},
    {value: "Debit Card", label: "Debit Card"},
    {value: "Credit Card", label: "Credit Card"},
    {value: "Transfer", label: "Transfer"},
    {value: "MobilePayment", label: "Mobile payment"},
    {value: "WebPayment", label: "Web payment"},
]


export const sortOptions = [
    { value: "newest", label: "Date (newest first)" },
    { value: "oldest", label: "Date (oldest first)" },
    { value: "highest", label: "Amount (High to Low)" },
    { value: "lowest", label: "Amount (Low to High)" },
]

export const userSortOptions = [
    { value: "creationNewest", label: "Account Created (newest)" },
    { value: "creationOldest", label: "Account Created (oldest)" },
    { value: "activityNewest", label: "Last Activity (newest)" },
    { value: "activityOldest", label: "Last Activity (oldest)" },
]

export const dataRangeOptions = [
    {value: "all", label: "Lifetime"},
    {value: "7days", label: "Last 7 days"},
    {value: "30days", label: "Last 30 days"},
    {value: "90days", label: "Last 90 days"},
    {value: "12months", label: "Last 12 months"},
    {value: "today", label: "Today"},
    {value: "thisMonth", label: "This month"},
    {value: "12months", label: "This year"},

]

