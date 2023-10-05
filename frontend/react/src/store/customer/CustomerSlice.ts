import {createSlice} from "@reduxjs/toolkit";
import {PURGE} from "redux-persist";
import {
    createCustomer,
    deleteCustomerById,
    findLatestCustomers,
    getCustomerById,
    getCustomersPage,
    resetCustomerPassword,
    updateCustomerById,
    uploadCustomerProfileImage
} from "./CustomerActions.ts";
import {Customer, CustomerPage, CustomerSlice, ServerError} from "../../types";

const initialCustomerPageState: CustomerPage = {
    customers: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    pageSize: 10,
    sort: 'customer_id,ASC',
    query: ''
};

const initialState: CustomerSlice = {
    customerPage: initialCustomerPageState,
    customers: [],
    customer: {} as Customer,
    error: {} as ServerError,
    status: 'idle',
};

const customerSlice = createSlice(({
    name: 'customer',
    initialState,
    reducers: {
        resetCustomerPageState: (state): void => {
            state.customerPage = initialCustomerPageState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(findLatestCustomers.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(findLatestCustomers.fulfilled, (state, action) => {
                state.status = 'success';
                state.error = {} as ServerError;
                state.customers = action.payload;
            })
            .addCase(findLatestCustomers.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(getCustomersPage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCustomersPage.fulfilled, (state, action) => {
                state.status = 'success';
                state.error = {} as ServerError;

                const {customers, query, totalItems, totalPages, sort} = action.payload;

                if (state.customerPage.query !== query) {
                    state.customerPage = {
                        customers: customers,
                        currentPage: 0,
                        totalItems: totalItems,
                        totalPages: totalPages,
                        pageSize: 10,
                        sort: sort,
                        query: query
                    };
                } else {
                    state.customerPage = action.payload;
                }
            })
            .addCase(getCustomersPage.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(createCustomer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createCustomer.fulfilled, (state) => {
                state.status = 'success';
                state.error = {} as ServerError;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(getCustomerById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCustomerById.fulfilled, (state, action) => {
                state.status = 'success';
                state.customer = action.payload;
                state.error = {} as ServerError;
            })
            .addCase(getCustomerById.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(updateCustomerById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCustomerById.fulfilled, (state) => {
                state.status = 'success';
                state.error = {} as ServerError;
            })
            .addCase(updateCustomerById.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(deleteCustomerById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCustomerById.fulfilled, (state, action) => {
                state.status = 'success';
                state.customers = state.customers.filter(customer => customer.id !== +action.meta.arg);
                state.error = {} as ServerError;
            })
            .addCase(deleteCustomerById.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(uploadCustomerProfileImage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadCustomerProfileImage.fulfilled, (state) => {
                state.status = 'success';
                state.error = {} as ServerError;
            })
            .addCase(uploadCustomerProfileImage.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(resetCustomerPassword.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(resetCustomerPassword.fulfilled, (state) => {
                state.status = 'success';
                state.error = {} as ServerError;
            })
            .addCase(resetCustomerPassword.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(PURGE, () => {
                return initialState;
            })
    }
}));

export const {resetCustomerPageState} = customerSlice.actions;
export default customerSlice.reducer;