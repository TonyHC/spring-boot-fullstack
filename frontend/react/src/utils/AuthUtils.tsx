import {persistor} from "../store/Store.tsx";
import {tokenDecoded} from "../store/auth/AuthActions.tsx";
import jwtDecode from "jwt-decode";

export const validateToken = (): boolean => {
    const token: string | null = localStorage.getItem("token");

    if (token) {
        const decodedToken: tokenDecoded = jwtDecode(token);

        if (Date.now() > decodedToken.exp * 1000) {
            void logout();
            return false;
        }

        return true;
    } else {
        return false;
    }
}

export const logout = async (): Promise<void> => {
    await persistor.purge();
    localStorage.removeItem("token");
};