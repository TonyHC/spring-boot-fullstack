import axios, {AxiosError, AxiosHeaders, AxiosHeaderValue, AxiosInstance} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {customerFormRoutes} from "../../hooks/CurrentPage.tsx";
import {
    CreateCustomerData,
    Customer,
    CustomerPage,
    DeleteCustomerByIdData,
    GetCustomerByIdData,
    GetCustomerPageData,
    ResetCustomerPasswordData,
    ServerError,
    UpdateCustomerData,
    UploadCustomerProfileImageData
} from "../../types";

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

export const createCustomer = createAsyncThunk<void, CreateCustomerData, { rejectValue: ServerError }>(
    "customer/createCustomer",
    async (data: CreateCustomerData, {rejectWithValue}) => {
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
            return rejectWithValue(handleError(err));
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
            return rejectWithValue(handleError(err));
        }
    }
)

export const getCustomersPage = createAsyncThunk<CustomerPage, GetCustomerPageData, { rejectValue: ServerError }>(
    "customer/getCustomerPage",
    async (data: GetCustomerPageData, {rejectWithValue}) => {
        try {
            const {page, size, sort, query} = data;

            const res = await customerAuthAPI.get<CustomerPage>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/page`, {
                params: {
                    query,
                    page,
                    size,
                    sort
                }
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
)

export const getCustomerById = createAsyncThunk<Customer, GetCustomerByIdData, { rejectValue: ServerError }>(
    "customer/getCustomerById",
    async (data: GetCustomerByIdData, {rejectWithValue}) => {
        const {customerId, navigate} = data;

        try {
            const res = await customerAuthAPI.get<Customer>(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`);
            return res.data;
        } catch (err) {
            navigate("/not-found", {replace: true});
            return rejectWithValue(handleError(err));
        }
    }
)

export const updateCustomerById = createAsyncThunk<void, UpdateCustomerData, { rejectValue: ServerError }>(
    "customer/updateCustomerById",
    async (data: UpdateCustomerData, {rejectWithValue}) => {
        try {
            const {customer, customerId, currentPath, navigate, query} = data;
            await customerAuthAPI.patch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`, customer);

            if (currentPath === customerFormRoutes[2].path) {
                if (query) {
                    navigate(`/customer-dashboard/${query}`, {replace: true});
                } else {
                    navigate("/customer-dashboard", {replace: true});
                }
            } else {
                navigate("/profile", {replace: true});
            }
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
)

export const deleteCustomerById = createAsyncThunk<void, DeleteCustomerByIdData, { rejectValue: ServerError }>(
    "customer/deleteCustomerById",
    async (data: DeleteCustomerByIdData, {rejectWithValue}) => {
        try {
            const {customerId, enqueueSnackbar} = data;
            await customerAuthAPI.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}`);
            enqueueSnackbar('Customer was deleted successfully', {variant: 'success'});
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
)

export const uploadCustomerProfileImage = createAsyncThunk<void, UploadCustomerProfileImageData, {
    rejectValue: ServerError
}>(
    "customer/uploadCustomerProfileImage",
    async (data: UploadCustomerProfileImageData, {rejectWithValue}) => {
        try {
            const {customerId, formData, provider, currentPath, navigate, enqueueSnackbar} = data;

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

            if (currentPath === customerFormRoutes[2].path) {
                navigate("/customer-dashboard", {replace: true});
            } else {
                navigate("/profile", {replace: true});
            }

            enqueueSnackbar('Upload profile image was successfully', {variant: 'success'});
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);

export const resetCustomerPassword = createAsyncThunk<void, ResetCustomerPasswordData, {
    rejectValue: ServerError
}>(
    "customer/resetCustomerPassword",
    async (data: ResetCustomerPasswordData, {rejectWithValue}) => {
        try {
            const {customerId, resetPassword, navigate, enqueueSnackbar, setValue} = data;

            await customerAuthAPI.patch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${customerId}/reset-password`,
                resetPassword
            );

            enqueueSnackbar('Password was reset successfully', {variant: 'success'});
            navigate("/profile", {replace: true});
            setValue(0);
        } catch (err) {
            return rejectWithValue(handleError(err));
        }
    }
);

const handleError = (err: unknown): ServerError => {
    const error: AxiosError<ServerError> = err as never;

    if (!error.response) {
        throw error;
    }

    return error.response.data;
};