import {createSlice} from "@reduxjs/toolkit";
import {PURGE} from "redux-persist";
import {
    createCustomer,
    deleteCustomerById,
    getAllCustomers,
    getCustomerById,
    updateCustomerById
} from "../actions/CustomerActions.tsx";

export type Customer = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    age: number,
    gender: string
}

type CustomerSlice = {
    customers: Customer[],
    customer: Customer,
    status: string,
    errors: unknown
}

const initialState: CustomerSlice = {
    customers: [],
    customer: {} as Customer,
    errors: {},
    status: "idle"
};

// TODO -> Call the PURGE action when logging out

const customerSlice = createSlice(({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCustomers.pending, (state) => {
            state.status = "loading";
        })
            .addCase(getAllCustomers.fulfilled, (state, action) => {
                state.status = "success";
                state.errors = {};
                state.customers = action.payload;
            })
            .addCase(getAllCustomers.rejected, (state, action) => {
                state.status = "error";
                state.errors = action.payload;
            })
            .addCase(createCustomer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createCustomer.fulfilled, (state) => {
                state.status = "success";
                state.errors = {};
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.status = "error";
                state.errors = action.payload;
            })
            .addCase(getCustomerById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getCustomerById.fulfilled, (state, action) => {
                state.status = "success";
                state.customer = action.payload;
                state.errors = {};
            })
            .addCase(getCustomerById.rejected, (state, action) => {
                state.status = "error";
                state.errors = action.payload;
            })
            .addCase(updateCustomerById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateCustomerById.fulfilled, (state) => {
                state.status = "success";
                state.errors = {};
            })
            .addCase(updateCustomerById.rejected, (state, action) => {
                state.status = "error";
                state.errors = action.payload;
            })
            .addCase(deleteCustomerById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteCustomerById.fulfilled, (state) => {
                state.status = "success";
                state.errors = {};
            })
            .addCase(deleteCustomerById.rejected, (state, action) => {
                state.status = "error";
                state.errors = action.payload;
            })
            .addCase(PURGE, () => initialState);
    }
}))

export default customerSlice.reducer;