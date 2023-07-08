import axios from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getAllCustomers = createAsyncThunk(
    "customer/getAllCustomers",
    async(_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`);
            return res.data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
)