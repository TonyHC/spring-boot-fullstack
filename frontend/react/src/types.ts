import {NavigateFunction} from "react-router-dom";
import {FieldHookConfig, FormikValues} from "formik";
import {EnqueueSnackbar} from "notistack";
import React from "react";

// Handle the error for API calls
export interface ServerError {
    timestamp: string;
    statusCode: number;
    message: string;
    path: string;
}

// Auth
export interface LoginRequest {
    username: string,
    password: string
}

export interface PerformLoginData {
    navigate: NavigateFunction;
    user: LoginRequest;
}

export interface TokenDecoded {
    exp: number;
    iat: number;
    iss: string;
    scopes: string[];
    sub: string;
}

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    gender: string;
    profileImage: string | null;
    roles: string[];
    username: string;
}

export type AuthSlice = {
    user: User;
    isAuth: boolean;
    error: ServerError | undefined;
    status: string;
    openActionsList: boolean;
}

// Customer
export interface CreateCustomerData {
    navigate: NavigateFunction;
    customer: FormikValues;
}

export interface UpdateCustomerData {
    customer: FormikValues;
    customerId: string;
    currentPath: string;
    navigate: NavigateFunction;
    query: string;
    enqueueSnackbar: EnqueueSnackbar;
}

export interface GetCustomerPageData {
    query: string;
    page: number;
    size: number;
    sort: string;
}

export interface GetCustomerByIdData {
    customerId: string;
    navigate: NavigateFunction;
}

export interface DeleteCustomerByIdData {
    customerId: string;
    enqueueSnackbar: EnqueueSnackbar;
}

export interface UploadCustomerProfileImageData {
    customerId: string;
    formData: FormData;
    provider: string;
    currentPath?: string;
    navigate: NavigateFunction;
    enqueueSnackbar: EnqueueSnackbar;
}

export interface ResetCustomerPasswordData {
    customerId: string;
    resetPassword: FormikValues;
    navigate: NavigateFunction;
    enqueueSnackbar: EnqueueSnackbar;
    setValue: React.Dispatch<React.SetStateAction<number>>;
}

export type Customer = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    gender: string;
    profileImage: string | null;
};

export type CustomerPage = {
    customers: Customer[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
    sort: string;
    query: string;
};

export type CustomerSlice = {
    customerPage: CustomerPage;
    customers: Customer[];
    customer: Customer;
    status: string;
    error: ServerError | undefined;
    actionType: string;
};

// Reusable UI
export type BaseTextFieldProps = FieldHookConfig<string> & {
    id: string,
    label: string,
    type: string,
    placeholder?: string
};


export type BaseSelectProps = FieldHookConfig<string> & {
    labelId: string,
    id: string,
    label: string,
    name: string,
    children: React.ReactNode
}