import {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {ServerError} from "../types.ts";
import {AsyncThunkAction} from "@reduxjs/toolkit";
import {AppDispatch} from "../store/Store.tsx";

/*
 * Reusable thunk hook to do the following:
 *
 * 1. Execute the thunk and update the loading / error state
 * 2. Manage the loading state (for a component)
 * 3. Manage the error state (for a component)
 */


const useThunk = <T>(thunk: (arg: T) => AsyncThunkAction<void | object, T, NonNullable<unknown>>) => {
    const dispatch = useDispatch<AppDispatch>();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({} as ServerError);

    const runThunk = useCallback((arg: T) => {
        setIsLoading(true);
        dispatch(thunk(arg))
            .unwrap()
            .catch((err: ServerError) => setError(err))
            .finally(() => setIsLoading(false));
    }, [dispatch, thunk]);


    return {
        runThunk, isLoading, error
    }
};

export {useThunk};