import {Location, Navigate, Outlet, useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/Store.tsx";
import {useEffect} from "react";
import {retrieveUser, tokenDecoded} from "../store/auth/AuthActions.tsx";
import jwtDecode from "jwt-decode";
import {validateToken} from "../utils/AuthUtils.tsx";

export const RequireAuth = () => {
    const validToken: boolean = validateToken();

    const location: Location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    // Auto logout feature to remove jwt from localStorage when current jwt expired
    useEffect(() => {
        if (validToken) {
            const token = localStorage.getItem("token")!;
            const decodedToken: tokenDecoded = jwtDecode(token);
            void dispatch(retrieveUser(decodedToken.sub));
        }
    }, [dispatch, validToken]);

    if (!validToken) {
        return <Navigate to="/login" state={{from: location}}/>
    }

    return <Outlet/>
};