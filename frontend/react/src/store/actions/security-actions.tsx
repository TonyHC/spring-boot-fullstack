import { createAsyncThunk } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import axios from "axios";

interface data {
  navigate: NavigateFunction;
  user: string
}

export const register = createAsyncThunk(
  "security/register",
  async(data: data, { rejectWithValue }) => {
    try {
        const { user, navigate} = data;
        await axios.post('', user);
        navigate('login', { replace: true })
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);