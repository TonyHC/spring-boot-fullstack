import axios, {AxiosError, AxiosHeaders} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {NavigateFunction} from "react-router-dom";
import {Customer} from "./CustomerSlice.tsx";
import {FormikValues} from "formik";

interface createCustomerData {
    navigate: NavigateFunction;
    customer: FormikValues;
}

interface updateCustomerData {
    navigate: NavigateFunction;
    customer: FormikValues;
    customerId: string;
}

export interface ServerError {
    timestamp: string;
    statusCode: number;
    message: string;
    path: string;
}

export const customerAuthAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`
});

customerAuthAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const createCustomer = createAsyncThunk<void, createCustomerData, { rejectValue: ServerError }>(
    "customer/createCustomer",
    async (data: createCustomerData, {rejectWithValue}) => {
        try {
            const {customer, navigate} = data;
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`, customer);
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

export const getAllCustomers = createAsyncThunk<Customer[], void, { rejectValue: ServerError }>(
    "customer/getAllCustomers",
    async (_, {rejectWithValue}) => {
        try {
            const res = await customerAuthAPI.get<Customer[]>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`);
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

export const getCustomerById = createAsyncThunk<Customer, string, { rejectValue: ServerError }>(
    "customer/getCustomerById",
    async (customerId: string, {rejectWithValue}) => {
        try {
            const res = await customerAuthAPI.get<Customer>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`);
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

export const updateCustomerById = createAsyncThunk<void, updateCustomerData, { rejectValue: ServerError }>(
    "customer/updateCustomerById",
    async (data: updateCustomerData, {rejectWithValue}) => {
        try {
            const {customer, navigate, customerId} = data;
            await customerAuthAPI.patch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`, customer);
            navigate("/customer-dashboard", {replace: true})
        } catch (err) {
            const error: AxiosError<ServerError> = err as never;

            if (!error.response) {
                throw err
            }

            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteCustomerById = createAsyncThunk<void, string, { rejectValue: ServerError }>(
    "customer/deleteCustomerById",
    async (customerId: string, {rejectWithValue}) => {
        try {
            await customerAuthAPI.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`);
        } catch (err) {
            const error: AxiosError<ServerError> = err as never;

            if (!error.response) {
                throw err
            }

            return rejectWithValue(error.response.data)
        }
    }
)