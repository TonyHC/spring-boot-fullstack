import {describe, expect, test} from "vitest";
import {Customer, CustomerPage, IPreloadedState, ServerError, User} from "../types.ts";
import {renderWithProviders} from "../test/mockedStoreWrapper.tsx";
import {MemoryRouter} from "react-router-dom";
import NotFoundPage from "./NotFoundPage.tsx";
import {screen} from "@testing-library/react";

const renderComponentWithProvider = (preloadedState: IPreloadedState) => {
    renderWithProviders(
        <MemoryRouter>
            <NotFoundPage/>
        </MemoryRouter>,
        {
            preloadedState
        }
    );
};

describe('User is not logged in', () => {
    test('it should the show correct link to the home page', () => {
        const preloadedState: IPreloadedState = {
            auth: {
                isAuth: false,
                user: {} as User,
                status: 'idle',
                error: {} as ServerError,
                openActionsList: true
            },
            customer: {
                customers: [],
                customerPage: {} as CustomerPage,
                customer: {} as Customer,
                status: 'idle',
                error: {} as ServerError
            }
        };

        renderComponentWithProvider(preloadedState);

        const homePageLink = screen.getByRole('link', {
            name: /return back to the home page/i
        });

        expect(homePageLink).toBeInTheDocument();
        expect(homePageLink).toHaveAttribute('href', '/');
    });
});

describe('User is logged in', () => {
    test('it should show the correct link to the dashboard page', () => {
        const preloadedState: IPreloadedState = {
            auth: {
                isAuth: true,
                user: {
                    id: 1,
                    firstName: 'test',
                    lastName: 'users',
                    email: 'testusers@gmail.com',
                    age: 32,
                    gender: 'MALE',
                    profileImage: '',
                    roles: ['USER_ROLE'],
                    username: 'testusers@gmail.com'
                },
                status: 'success',
                error: {} as ServerError,
                openActionsList: false
            },
            customer: {
                customers: [],
                customerPage: {} as CustomerPage,
                customer: {} as Customer,
                status: 'idle',
                error: {} as ServerError
            }
        };

        renderComponentWithProvider(preloadedState);

        const dashboardLink = screen.getByRole('link', {
            name: /return back to the dashboard/i
        });

        expect(dashboardLink).toBeInTheDocument();
        expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });
});