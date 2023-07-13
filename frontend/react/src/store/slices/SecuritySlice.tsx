import { createSlice } from "@reduxjs/toolkit";

import { register } from "../actions/SecurityActions.tsx";

const initialState = {
  user: {},
  isAuth: true,
  errors: {},
  status: "idle"
};

const securitySlice = createSlice({
  name: "security",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state, action) => {
      state.status = "loading";
      console.log(action);
    })
    .addCase(register.fulfilled, (state, action) => {
      state.status = "success";
      state.errors = {};
      console.log(action);
    });
  }
});

export default securitySlice.reducer;