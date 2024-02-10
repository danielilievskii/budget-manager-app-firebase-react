import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifyWalletUpdate = (name) => {
    toast.success(
        <span>
            The <strong>"{name}"</strong> wallet was successfully updated!
        </span>, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        pauseOnFocusLoss: false
    });
};

export const notifyWalletDelete = (name) => {
    toast.success(
        <span>
            The <strong>"{name}"</strong> wallet was successfully deleted!
        </span>, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        pauseOnFocusLoss: false
    });
}

export const notifyWalletAdd = (name) => {
    toast.success(
        <span>
            The <strong>"{name}"</strong> wallet was successfully added!
        </span>, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const errorLogin = () => {
    toast.error("Invalid email or password.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const warnWalletAdd = () => {
    toast.warn("Wallet couldn't be added. Try again!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const notifyRecordUpdate = (place) => {
    toast.success(
        <span>
            The <strong>"{place}"</strong> record was successfully updated!
        </span>, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const notifyRecordDelete = (place) => {
    toast.success(
        <span>
            The <strong>"{place}"</strong> record was successfully deleted!
        </span>, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const notifyRecordAdd = (place) => {
    toast.success(
        <span>
            The <strong>"{place}"</strong> record was successfully added!
        </span>, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

//ADMIN PANEL

export const notifyAdminRole = (displayName) => {
    toast.success(
        <span>
            Role assignment: <strong>{displayName}</strong> is now an admin.
        </span>,
        {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const notifyBudgeteerRole = (displayName) => {
    toast.success(
        <span>
            Role assignment: <strong>{displayName}</strong> is now a budgeteer.
        </span>,
        {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const notifyDataReset = (displayName) => {
    toast.success(
        <span>
            User data for <strong>{displayName}</strong> has been reset successfully.
        </span>, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const notifyAccountDelete = (displayName) => {
    toast.success(
        <span>
            Account termination: <strong>{displayName}</strong>'s account has been deleted.
        </span>, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}
