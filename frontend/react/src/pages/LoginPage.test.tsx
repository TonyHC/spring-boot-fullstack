import {expect, test} from "vitest";
import {renderWithProviders} from "../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import LoginPage from "./LoginPage.tsx";
import {Customer, CustomerPage, IPreloadedState, ServerError, User} from "../types.ts";
import {screen} from "@testing-library/react";
import user from "@testing-library/user-event";
import {createServer} from "../test/server.ts";
import {createMemoryHistory, MemoryHistory} from "history";

const renderComponentWithProvider = () => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: ['/login']});

    const preloadedState: IPreloadedState = {
        auth: {
            isAuth: false,
            user: {} as User,
            status: 'success',
            error: {} as ServerError,
            openActionsList: true
        },
        customer: {
            customers: [],
            customerPage: {} as CustomerPage,
            customer: {} as Customer,
            status: 'success',
            error: {} as ServerError
        }
    }

    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <LoginPage/>
        </Router>,
        {
            preloadedState
        }
    )

    return {
        history
    };
};

describe('User enters their login credentials', () => {
    createServer([
        {
            method: 'post',
            path: 'http://localhost:8080/api/v1/auth/login',
            statusCode: 200,
            res: () => {
                return {}
            }
        }
    ]);

    test('it should change current location to dashboard upon successful authentication', async () => {
        const {history} = renderComponentWithProvider();

        const usernameInput = screen.getByRole('textbox', {
            name: /username/i
        });

        const passwordInput = screen.getByLabelText(/password/i);

        await user.click(usernameInput);
        await user.keyboard('dummyusers@mail.com');

        await user.click(passwordInput);
        await user.keyboard('password');

        const signInButton = await screen.findByRole('button', {
            name: /sign in/i
        });

        await user.click(signInButton);

        expect(signInButton).not.toBeDisabled();
        expect(history.location.pathname).toBe('/dashboard');
    });

    test('it should disable the button when form validation fails', async () => {
        renderComponentWithProvider();

        const usernameInput = screen.getByRole('textbox', {
            name: /username/i
        });

        const passwordInput = screen.getByLabelText(/password/i);

        await user.click(usernameInput);
        await user.keyboard('testers@@hotmail.com');

        await user.click(passwordInput);
        await user.keyboard('pass');

        const signInButton = await screen.findByRole('button', {
            name: /sign in/i
        });

        expect(signInButton).toBeDisabled();
    });

    test('it should show form validation errors', async () => {
        renderComponentWithProvider();

        const usernameInput = screen.getByRole('textbox', {
            name: /username/i
        });

        const passwordInput = screen.getByLabelText(/password/i);

        await user.click(usernameInput);
        await user.keyboard('testers');

        await user.click(passwordInput);
        await user.keyboard('pass');

        await user.click(usernameInput);
        await user.click(passwordInput);

        const usernameErrorAlert = await screen.findByText('Must be a valid email');
        const passwordErrorAlert = await screen.findByText('Password cannot be less than 6 characters');

        expect(usernameErrorAlert).toBeInTheDocument();
        expect(passwordErrorAlert).toBeInTheDocument();
    });
});

describe('User submits invalid login credentials', () => {
    createServer([
        {
            method: 'post',
            path: 'http://localhost:8080/api/v1/auth/login',
            statusCode: 401,
            res: () => {
                return {
                    timestamp: '2023-09-01T09:09:25.0664291',
                    statusCode: 401,
                    message: 'Bad credentials',
                    path: '/api/v1/auth/login'
                };
            }
        }
    ])

    test('it should show an error alert', async () => {
        renderComponentWithProvider();

        const usernameInput = screen.getByRole('textbox', {
            name: /username/i
        });

        const passwordInput = screen.getByLabelText(/password/i);

        await user.click(usernameInput);
        await user.keyboard('dummyusers@hotmail.com');

        await user.click(passwordInput);
        await user.keyboard('passwords');

        const signInButton = await screen.findByRole('button', {
            name: /sign in/i
        });

        expect(signInButton).not.toBeDisabled();

        await user.click(signInButton);

        const errorMessageAlert = await screen.findByText('Bad credentials');

        expect(errorMessageAlert).toBeInTheDocument();
        expect(errorMessageAlert).toHaveClass('MuiAlert-message')
    });
});

describe('User clicks on the Join Now link', () => {
    test('it should navigate the user to the sign in page', async () => {
        const {history} = renderComponentWithProvider();

        const joinNowLink = screen.getByRole('link', {
            name: /join now/i
        });

        await user.click(joinNowLink);

        expect(history.location.pathname).toBe('/sign-up')
    })
});