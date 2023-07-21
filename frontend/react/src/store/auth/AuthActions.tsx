import axios, {AxiosError, AxiosHeaders} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {NavigateFunction} from "react-router-dom";
import {customerAuthAPI} from "../customer/CustomerActions.tsx";
import {User} from "./AuthSlice.tsx";

export type loginRequest = {
    username: string,
    password: string
}

interface performLoginData {
    navigate: NavigateFunction;
    user: loginRequest;
}

export interface tokenDecoded {
    exp: number;
    iat: number;
    iss: string;
    scopes: string[];
    sub: string;
}

interface ServerError {
    timestamp: string;
    statusCode: number;
    message: string;
    path: string;
}

export const performLogin = createAsyncThunk<void, performLoginData, { rejectValue: ServerError }>(
    "auth/performLogin",
    async (data: performLoginData, {rejectWithValue}) => {
        try {
            const {user, navigate} = data;
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`, user);
            const headers = res.headers;

            if (headers instanceof AxiosHeaders) {
                const token = headers.get("authorization");

                if (typeof token === "string") {
                    localStorage.setItem("token", token);
                }
            }

            navigate("/customer-dashboard", {replace: true});
        } catch (err) {
            const error: AxiosError<ServerError> = err as never;

            if (!error.response) {
                throw err
            }

            return rejectWithValue(error.response.data)
        }
    }
)

export const retrieveUser = createAsyncThunk<User, string, { rejectValue: ServerError }>(
    "auth/retrieveUser",
    async (email: string, {rejectWithValue}) => {
        try {
            const res =
                await customerAuthAPI.get<User>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/email/${email}`);
            return res.data;
        } catch (err) {
            const error: AxiosError<ServerError> = err as never;

            if (!error.response) {
                throw err
            }

            return rejectWithValue(error.response.data)
        }
    }
)