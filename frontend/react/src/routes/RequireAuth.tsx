import {Location, Navigate, Outlet, useLocation} from "react-router-dom";
import {useEffect} from "react";
import {retrieveUser} from "../store/auth/AuthActions.ts";
import jwtDecode from "jwt-decode";
import {logout, validateToken} from "../utils/AuthUtils.ts";
import {TokenDecoded} from "../types.ts";
import {useThunk} from "../hooks/useThunk.ts";

const RequireAuth = () => {
    const validToken: boolean = validateToken();
    const location: Location = useLocation();
    const {runThunk: runRetrieveUser} = useThunk(retrieveUser);

    // Auto logout feature to remove jwt from localStorage when current jwt expired
    useEffect(() => {
        if (validToken) {
            const token: string = localStorage.getItem("token")!;
            const decodedToken: TokenDecoded = jwtDecode(token);
            runRetrieveUser(decodedToken.sub);
        } else {
            void logout();
        }
    }, [runRetrieveUser, validToken]);

    if (!validToken) {
        return <Navigate to="/login" state={{from: location}}/>
    }

    return <Outlet/>
};

export default RequireAuth;