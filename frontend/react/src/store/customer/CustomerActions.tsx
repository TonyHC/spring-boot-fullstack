import axios, {AxiosError, AxiosHeaders, AxiosHeaderValue, AxiosInstance} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {NavigateFunction} from "react-router-dom";
import {Customer, CustomerPage} from "./CustomerSlice.tsx";
import {FormikValues} from "formik";

interface createCustomerData {
    navigate: NavigateFunction;
    customer: FormikValues;
}

interface updateCustomerData {
    customer: FormikValues;
    customerId: string;
    navigate: NavigateFunction;
}

interface getCustomerPageData {
    page: number;
    size: number;
    sort: string;
}

interface uploadCustomerProfileImageData {
    customerId: string;
    formData: FormData;
    provider: string;
    navigate: NavigateFunction;
}

export interface ServerError {
    timestamp: string;
    statusCode: number;
    message: string;
    path: string;
}

export const customerAuthAPI: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`
});

customerAuthAPI.interceptors.request.use((config) => {
    const token: string | null = localStorage.getItem("token");

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
                const token: AxiosHeaderValue = headers.get("authorization");

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

export const findLatestCustomers = createAsyncThunk<Customer[], number, { rejectValue: ServerError }>(
    "customer/findLatestCustomers",
    async (size: number, {rejectWithValue}) => {
        try {
            const res = await customerAuthAPI.get<Customer[]>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`, {
                params: {
                    size
                }
            });
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

export const getCustomersPage = createAsyncThunk<CustomerPage, getCustomerPageData, { rejectValue: ServerError }>(
    "customer/getCustomerPage",
    async (data: getCustomerPageData, {rejectWithValue}) => {
        try {
            const {page, size, sort} = data;
            const res = await customerAuthAPI.get<CustomerPage>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/page`, {
                params: {
                    page,
                    size,
                    sort
                }
            });
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

export const uploadCustomerProfileImage = createAsyncThunk<void, uploadCustomerProfileImageData, {
    rejectValue: ServerError
}>(
    "customer/uploadCustomerProfileImage",
    async (data: uploadCustomerProfileImageData, {rejectWithValue}) => {
        try {
            const {customerId, formData, provider, navigate} = data;

            await customerAuthAPI.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}/profile-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    params: {
                        provider
                    }
                }
            );

            navigate("/customer-dashboard", {replace: true});
        } catch (err) {
            const error: AxiosError<ServerError> = err as never;

            if (!error.response) {
                throw err
            }

            return rejectWithValue(error.response.data)
        }
    }
);