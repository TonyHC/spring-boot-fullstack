import {persistor} from "../store/Store.tsx";
import jwtDecode from "jwt-decode";
import {TokenDecoded} from "../types.ts";

export const validateToken = (): boolean => {
    const token: string | null = localStorage.getItem("token");

    if (token) {
        const decodedToken: TokenDecoded = jwtDecode(token);
        return Date.now() <= decodedToken.exp * 1000;
    } else {
        return false;
    }
};

export const logout = async (): Promise<void> => {
    await persistor.purge();
    localStorage.removeItem("token");
};