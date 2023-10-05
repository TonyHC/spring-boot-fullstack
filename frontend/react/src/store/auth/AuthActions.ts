import axios, {AxiosHeaders, AxiosHeaderValue} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {customerAuthAPI} from "../customer/CustomerActions.ts";
import {PerformLoginData, ServerError, User} from "../../types";
import {handleError} from "../../utils/ErrorHandlingUtils.ts";

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
            return rejectWithValue(handleError(err));
        }
    }
);

export const retrieveUser = createAsyncThunk<User, string, { rejectValue: ServerError }>(
    "auth/retrieveUser",
    async (email: string, {rejectWithValue}) => {
        try {
            const res =
                await customerAuthAPI.get<User>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/email/${email}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);