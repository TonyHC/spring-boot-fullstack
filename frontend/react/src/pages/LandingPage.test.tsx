import {describe, expect, test} from "vitest";
import {Customer, CustomerPage, IPreloadedState, ServerError, User} from "../types.ts";
import {createMemoryHistory, MemoryHistory} from "history";
import {renderWithProviders} from "../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import LandingPage from "./LandingPage.tsx";
import {screen} from "@testing-library/react";
import user from "@testing-library/user-event";

const renderComponentWithProvider = (preloadedState: IPreloadedState) => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: ['/']});

    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <LandingPage/>
        </Router>,
        {
            preloadedState
        }
    );

    return {
        history
    };
};

describe('User is not logged in', () => {
    test('it should show the Login and Sign up buttons when user is logged in', () => {
        const preloadedState: IPreloadedState = {
            auth: {
                isAuth: false,
                user: {} as User,
                error: {} as ServerError,
                status: '',
                openActionsList: false
            },
            customer: {
                customers: [],
                customerPage: {} as CustomerPage,
                status: '',
                error: {} as ServerError,
                customer: {} as Customer,
            }
        };

        renderComponentWithProvider(preloadedState);

        const signInButton = screen.getByRole('button', {
            name: /sign in/i
        });

        const signUpButton = screen.getByRole('button', {
            name: /sign up/i
        });

        expect(signInButton).toBeInTheDocument();
        expect(signUpButton).toBeInTheDocument();
    });

    test('it should change current location to login when sign in button is clicked', async () => {
        const preloadedState: IPreloadedState = {
            auth: {
                isAuth: false,
                user: {} as User,
                error: {} as ServerError,
                status: '',
                openActionsList: false
            },
            customer: {
                customers: [],
                customerPage: {} as CustomerPage,
                status: '',
                error: {} as ServerError,
                customer: {} as Customer,
            }
        };

        const {history} = renderComponentWithProvider(preloadedState);

        const signInButton = screen.getByRole('button', {
            name: /sign in/i
        });

        await user.click(signInButton);

        expect(history.location.pathname).toBe('/login');
    });

    test('it should change current location to login when sign out button is clicked', async () => {
        const preloadedState: IPreloadedState = {
            auth: {
                isAuth: false,
                user: {} as User,
                error: {} as ServerError,
                status: '',
                openActionsList: false
            },
            customer: {
                customers: [],
                customerPage: {} as CustomerPage,
                status: '',
                error: {} as ServerError,
                customer: {} as Customer,
            }
        };

        const {history} = renderComponentWithProvider(preloadedState);

        const signUpButton = screen.getByRole('button', {
            name: /sign up/i
        });

        await user.click(signUpButton);

        expect(history.location.pathname).toBe('/sign-up');
    });
});

describe('User is logged in', () => {
    test('it should not show the Login and Sign up buttons when user is not logged in', () => {
        const preloadedState: IPreloadedState = {
            auth: {
                isAuth: true,
                user: {
                    id: 1,
                    firstName: 'Dummy',
                    lastName: 'Users',
                    age: 39,
                    email: 'dummyusers@mail.com',
                    gender: 'MALE',
                    username: 'dummyusers@mail.com',
                    profileImage: '',
                    roles: ['ROLE_USER']
                },
                error: {} as ServerError,
                status: '',
                openActionsList: false
            },
            customer: {
                customers: [],
                customerPage: {} as CustomerPage,
                status: '',
                error: {} as ServerError,
                customer: {} as Customer,
            }
        };

        renderComponentWithProvider(preloadedState);

        const dashboardButton = screen.getByRole('button', {
            name: /dashboard/i
        });

        expect(dashboardButton).toBeInTheDocument();
    });

    test('it should change current location to dashboard when dashboard button is clicked', async () => {
        const preloadedState: IPreloadedState = {
            auth: {
                isAuth: true,
                user: {
                    id: 1,
                    firstName: 'Dummy',
                    lastName: 'Users',
                    age: 39,
                    email: 'dummyusers@mail.com',
                    gender: 'MALE',
                    username: 'dummyusers@mail.com',
                    profileImage: '',
                    roles: ['ROLE_USER']
                },
                error: {} as ServerError,
                status: '',
                openActionsList: false
            },
            customer: {
                customers: [],
                customerPage: {} as CustomerPage,
                status: '',
                error: {} as ServerError,
                customer: {} as Customer,
            }
        };

        const {history} = renderComponentWithProvider(preloadedState);

        const dashboardButton = screen.getByRole('button', {
            name: /dashboard/i
        });

        await user.click(dashboardButton);

        expect(history.location.pathname).toBe('/dashboard');
    });
});