import {createSlice} from "@reduxjs/toolkit";
import {PURGE} from "redux-persist";
import {performLogin, retrieveUser} from "./AuthActions.ts";
import {createCustomer} from "../customer/CustomerActions.ts";
import {AuthSlice, ServerError, User} from "../../types";

const initialState: AuthSlice = {
    user: {} as User,
    isAuth: false,
    error: {} as ServerError,
    status: "idle",
    openActionsList: false
};

const authSlice = createSlice(({
    name: "auth",
    initialState,
    reducers: {
        toggleOpenActionListState: (state) => {
            state.openActionsList = !state.openActionsList;
        },
        resetOpenActionsListState: (state) => {
            state.openActionsList = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => {
            return initialState;
        })
            .addCase(performLogin.pending, (state) => {
                state.status = "loading";
            })
            .addCase(performLogin.fulfilled, (state) => {
                state.status = "success";
                state.isAuth = true;
                state.error = {} as ServerError;
            })
            .addCase(performLogin.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })
            .addCase(createCustomer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createCustomer.fulfilled, (state) => {
                state.status = "success";
                state.isAuth = true;
                state.error = {} as ServerError;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })
            .addCase(retrieveUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(retrieveUser.fulfilled, (state, action) => {
                state.status = "success";
                state.error = {} as ServerError;
                state.user = action.payload;
            })
            .addCase(retrieveUser.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })
    }
}))

export const {toggleOpenActionListState, resetOpenActionsListState} = authSlice.actions;
export default authSlice.reducer;