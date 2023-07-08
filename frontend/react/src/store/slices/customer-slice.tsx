import {createSlice} from "@reduxjs/toolkit";
import {getAllCustomers} from "../actions/customer-actions.tsx";

export type Customer = {
    id: number,
    name: string,
    email: string,
    age: number
}

type CustomerSlice = {
    customers: Customer[],
    status: string,
    errors: unknown
}

const initialState: CustomerSlice = {
    customers: [],
    errors: {},
    status: "idle"
};

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
                console.log(action.payload);
            })
    }
}))

export default customerSlice.reducer;