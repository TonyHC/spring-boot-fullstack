import {expect, test} from "vitest";
import reducer, {resetErrorState, updateCustomerPageState} from "./CustomerSlice.tsx";
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
            status: 'idle',
            actionType: ''
        });
    });

    test('it should reset the error state', () => {
        const previousState = {
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
            error: {
                timestamp: '2023-09-01T09:09:46.419221',
                statusCode: 404,
                message: 'Customer with id [12a] was not found',
                path: '/api/v1/customers/12a'
            },
            status: 'idle',
            actionType: ''
        };

        expect(reducer(previousState, resetErrorState)).toEqual({
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
            status: 'idle',
            actionType: ''
        });
    });

    test('it should update customer page state', () => {
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
            status: 'idle',
            actionType: ''
        };

        expect(reducer(previousState, updateCustomerPageState)).toEqual({
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
            status: 'idle',
            actionType: ''
        });
    });
});