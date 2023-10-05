import {expect, test} from "vitest";
import reducer, {resetCustomerPageState} from "./CustomerSlice.ts";
import {Customer, ServerError} from "../../types.ts";

describe('CustomerReducer tests', () => {
    test('it should return the initial state', () => {
        expect(reducer(undefined, {type: undefined})).toEqual({
            customerPage: {
                customers: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 10,
                sort: 'customer_id,ASC',
                query: ''
            },
            customers: [],
            customer: {} as Customer,
            error: {} as ServerError,
            status: 'idle'
        });
    });

    test('it should reset customer page state', () => {
        const previousState = {
            customerPage: {
                customers: [
                    {
                        id: 1,
                        firstName: 'tom',
                        lastName: 'banks',
                        email: 'tbanks@mail.com',
                        age: 41,
                        gender: 'MALE',
                        profileImage: ''
                    }
                ],
                currentPage: 1,
                totalItems: 1,
                totalPages: 1,
                pageSize: 10,
                sort: 'customer_id,ASC',
                query: 'bank'
            },
            customers: [],
            customer: {} as Customer,
            error: {} as ServerError,
            status: 'idle'
        };

        expect(reducer(previousState, resetCustomerPageState)).toEqual({
            customerPage: {
                customers: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 10,
                sort: 'customer_id,ASC',
                query: ''
            },
            customers: [],
            customer: {} as Customer,
            error: {} as ServerError,
            status: 'idle'
        });
    });
});