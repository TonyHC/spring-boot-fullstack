import {describe, expect, test} from "vitest";
import reducer, {resetErrorState, resetOpenActionsListState, toggleOpenActionListState} from "./AuthSlice.tsx";
import {ServerError, User} from "../../types.ts";

describe('AuthReducer tests', () => {
    test('it should return the initial state', () => {
        expect(reducer(undefined, {type: undefined})).toEqual({
            user: {} as User,
            isAuth: false,
            error: {} as ServerError,
            status: "idle",
            openActionsList: false
        })
    });

    test('it should reset the error state', () => {
        const previousState = {
            user: {} as User,
            isAuth: false,
            error: {
                timestamp: '2023-09-01T09:09:25.0664291',
                statusCode: 401,
                message: 'Bad credentials',
                path: '/api/v1/auth/login'
            },
            status: "idle",
            openActionsList: false
        };

        expect(reducer(previousState, resetErrorState)).toEqual({
            user: {} as User,
            isAuth: false,
            error: {} as ServerError,
            status: "idle",
            openActionsList: false
        });
    });

    test('it should toggle the openActionList state', () => {
        const previousState = {
            user: {} as User,
            isAuth: false,
            error: {} as ServerError,
            status: "idle",
            openActionsList: false
        };

        expect(reducer(previousState, toggleOpenActionListState)).toEqual({
            user: {} as User,
            isAuth: false,
            error: {} as ServerError,
            status: "idle",
            openActionsList: true
        });
    });

    test('it should reset the openActionList state to initial state', () => {
        const previousState = {
            user: {} as User,
            isAuth: false,
            error: {} as ServerError,
            status: "idle",
            openActionsList: false
        };

        reducer(previousState, toggleOpenActionListState);

        expect(reducer(previousState, resetOpenActionsListState)).toEqual({
            user: {} as User,
            isAuth: false,
            error: {} as ServerError,
            status: "idle",
            openActionsList: false
        })
    });
});