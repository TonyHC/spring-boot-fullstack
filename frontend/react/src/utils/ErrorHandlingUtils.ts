import {ServerError} from "../types.ts";
import {AxiosError} from "axios";

export const handleError = (err: unknown): ServerError => {
    const error: AxiosError<ServerError> = err as never;

    if (!error.response) {
        throw error;
    }

    return error.response.data;
};