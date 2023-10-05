import {describe, expect, test} from "vitest";
import reducer, {resetOpenActionsListState, toggleOpenActionListState} from "./AuthSlice.ts";
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