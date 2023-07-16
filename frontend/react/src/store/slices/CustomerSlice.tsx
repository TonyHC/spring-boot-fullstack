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
    errors: unknown,
    actionType: string
}

const initialState: CustomerSlice = {
    customers: [],
    customer: {} as Customer,
    errors: {},
    status: "idle",
    actionType: ""
};

// TODO -> Call the PURGE action when logging out

const customerSlice = createSlice(({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCustomers.pending, (state) => {
            state.status = "loading";
            state.actionType = getAllCustomers.typePrefix;
        })
            .addCase(getAllCustomers.fulfilled, (state, action) => {
                state.status = "success";
                state.actionType = getAllCustomers.typePrefix;
                state.errors = {};
                state.customers = action.payload;
            })
            .addCase(getAllCustomers.rejected, (state, action) => {
                state.status = "error";
                state.actionType = getAllCustomers.typePrefix;
                state.errors = action.payload;
            })
            .addCase(createCustomer.pending, (state) => {
                state.status = "loading";
                state.actionType = createCustomer.typePrefix;
            })
            .addCase(createCustomer.fulfilled, (state) => {
                state.status = "success";
                state.actionType = createCustomer.typePrefix;
                state.errors = {};
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.status = "error";
                state.actionType = createCustomer.typePrefix;
                state.errors = action.payload;
            })
            .addCase(getCustomerById.pending, (state) => {
                state.status = "loading";
                state.actionType = getCustomerById.typePrefix;
            })
            .addCase(getCustomerById.fulfilled, (state, action) => {
                state.status = "success";
                state.actionType = getCustomerById.typePrefix;
                state.customer = action.payload;
                state.errors = {};
            })
            .addCase(getCustomerById.rejected, (state, action) => {
                state.status = "error";
                state.actionType = getCustomerById.typePrefix;
                state.errors = action.payload;
            })
            .addCase(updateCustomerById.pending, (state) => {
                state.status = "loading";
                state.actionType = updateCustomerById.typePrefix;
            })
            .addCase(updateCustomerById.fulfilled, (state) => {
                state.status = "success";
                state.actionType = updateCustomerById.typePrefix;
                state.errors = {};
            })
            .addCase(updateCustomerById.rejected, (state, action) => {
                state.status = "error";
                state.actionType = updateCustomerById.typePrefix;
                state.errors = action.payload;
            })
            .addCase(deleteCustomerById.pending, (state) => {
                state.status = "loading";
                state.actionType = deleteCustomerById.typePrefix;
            })
            .addCase(deleteCustomerById.fulfilled, (state, action) => {
                console.log(action.meta.arg);
                state.status = "success";
                state.actionType = deleteCustomerById.typePrefix;
                state.customers = state.customers.filter(customer => customer.id !== +action.meta.arg);
                state.errors = {};
            })
            .addCase(deleteCustomerById.rejected, (state, action) => {
                state.status = "error";
                state.actionType = deleteCustomerById.typePrefix;
                state.errors = action.payload;
            })
            .addCase(PURGE, () => initialState);
    }
}))

export default customerSlice.reducer;