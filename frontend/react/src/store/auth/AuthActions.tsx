import axios, {AxiosError, AxiosHeaders, AxiosHeaderValue} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {customerAuthAPI} from "../customer/CustomerActions.tsx";
import {PerformLoginData, ServerError, User} from "../../types";

export const performLogin = createAsyncThunk<void, PerformLoginData, { rejectValue: ServerError }>(
    "auth/performLogin",
    async (data: PerformLoginData, {rejectWithValue}) => {
        try {
            const {user, navigate} = data;
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`, user);
            const headers = res.headers;

            if (headers instanceof AxiosHeaders) {
                const token: AxiosHeaderValue = headers.get("authorization");

                if (typeof token === "string") {
                    localStorage.setItem("token", token);
                }
            }

            navigate("/dashboard", {replace: true});
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