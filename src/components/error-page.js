import "./error-page.css"
import {Link} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../config/firebase";

export const ErrorPage = () => {
    const [user, loading] = useAuthState(auth);

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 landing-page">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"><span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead">
                    The page you’re looking for is not available or doesn’t exist.
                </p>
                {user && <Link to="/dashboard" className="go-back-btn">Go back</Link>}
                {!user && <Link to="/" className="go-back-btn">Go back</Link>}

            </div>
        </div>
    )
}