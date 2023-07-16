import axios, {AxiosError} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {NavigateFunction} from "react-router-dom";
import {Customer} from "../slices/CustomerSlice.tsx";

export type createCustomer = {
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    gender: string
}

interface createCustomerData {
    navigate: NavigateFunction;
    customer: createCustomer
}

interface updateCustomerData {
    navigate: NavigateFunction;
    customer: createCustomer,
    customerId: string
}

interface ServerError {
    timestamp: string,
    statusCode: number
    message: string,
    path: string
}

export const createCustomer = createAsyncThunk(
    "customer/createCustomer",
    async (data: createCustomerData, {rejectWithValue}) => {
        try {
            const {customer, navigate} = data;
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`, customer);
            navigate("/customer-dashboard", {replace: true})
        } catch (error: unknown) {
            return rejectWithValue(handleErrorResponse(error));
        }
    }
)

export const getAllCustomers = createAsyncThunk(
    "customer/getAllCustomers",
    async (_, {rejectWithValue}) => {
        try {
            const res = await axios.get<Customer[]>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`);
            return res.data;
        } catch (error: unknown) {
            return rejectWithValue(handleErrorResponse(error));
        }
    }
)

export const getCustomerById = createAsyncThunk(
    "customer/getCustomerById",
    async (customerId: string, {rejectWithValue}) => {
        try {
            const res = await axios.get<Customer>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`);
            return res.data;
        } catch (error: unknown) {
            return rejectWithValue(handleErrorResponse(error));
        }
    }
)

export const updateCustomerById = createAsyncThunk(
    "customer/updateCustomerById",
    async (data: updateCustomerData, {rejectWithValue}) => {
        try {
            const {customer, navigate, customerId} = data;
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`, customer);
            navigate("/customer-dashboard", {replace: true})
        } catch (error: unknown) {
            return rejectWithValue(handleErrorResponse(error));
        }
    }
)

export const deleteCustomerById = createAsyncThunk(
    "customer/deleteCustomerById",
    async (customerId: string, {rejectWithValue}) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`);
            // navigate(0);
        } catch (error: unknown) {
            return rejectWithValue(handleErrorResponse(error));
        }
    }
)

const handleErrorResponse = (error: unknown) => {
    const err = error as AxiosError<ServerError>;
    return err.response?.data;
}