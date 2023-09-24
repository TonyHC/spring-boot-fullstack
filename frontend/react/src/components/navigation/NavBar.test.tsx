import {describe, expect, test} from "vitest";
import {renderWithProviders} from "../../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import NavBar from "./Navbar.tsx";
import {Customer, CustomerPage, IPreloadedState, ServerError, User} from "../../types.ts";
import {screen} from "@testing-library/react";
import {createMemoryHistory, MemoryHistory} from "history";
import user from "@testing-library/user-event";

const renderComponentWithProviderWhenNotAuthenticated = (initialRoute: string) => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: [initialRoute]});

    const preloadedState: IPreloadedState = {
        auth: {
            isAuth: false,
            user: {} as User,
            status: 'idle',
            error: {} as ServerError,
            openActionsList: false
        },
        customer: {
            customers: [],
            customerPage: {} as CustomerPage,
            customer: {} as Customer,
            actionType: '',
            status: 'idle',
            error: {} as ServerError
        }
    };

    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <NavBar/>
        </Router>,
        {
            preloadedState
        }
    );

    return {
        history
    }
};

const renderComponentWithProviderWhenAuthenticated = (showAutocomplete: boolean, status: string, initialRoute: string) => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: [initialRoute]});

    const preloadedState: IPreloadedState = {
        auth: {
            isAuth: true,
            user: {
                id: 1,
                firstName: 'Test',
                lastName: 'Users',
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
            customers: [
                {
                    id: 1,
                    firstName: 'Test',
                    lastName: 'Users',
                    email: 'testusers@gmail.com',
                    age: 32,
                    gender: 'MALE',
                    profileImage: ''
                },
                {
                    id: 2,
                    firstName: 'Dummy',
                    lastName: 'Users',
                    email: 'dummyusers@gmail.com',
                    age: 57,
                    gender: 'MALE',
                    profileImage: ''
                }
            ],
            customerPage: {
                customers: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 10,
                sort: 'customer_id,ASC',
                query: ''
            },
            customer: {} as Customer,
            actionType: '',
            status: 'success',
            error: {} as ServerError
        }
    };

    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <NavBar showAutocomplete={showAutocomplete} status={status}/>
        </Router>,
        {
            preloadedState
        }
    );

    return {
        preloadedState,
        history
    };
};

describe('User is not logged in', () => {
    test('it should show the login button when user is not logged in', () => {
        renderComponentWithProviderWhenNotAuthenticated('/');

        const loginButton = screen.getByRole('button', {
            name: /login/i
        });

        expect(loginButton).toBeInTheDocument();
    });

    test('it should change the current location to login page when the login button is clicked', async () => {
        const {history} = renderComponentWithProviderWhenNotAuthenticated('/');

        const loginButton = screen.getByRole('button', {
            name: /login/i
        });

        await user.click(loginButton);

        expect(history.location.pathname).toBe('/login');
    });

    test('it should change the location to the landing page when user clicks on the application icon', async () => {
        const {history} = renderComponentWithProviderWhenNotAuthenticated('/');

        const homeIconButton = screen.getByTestId('AdbIcon');

        await user.click(homeIconButton);

        expect(homeIconButton).toBeInTheDocument();
        expect(history.location.pathname).toBe('/')
    });
});

describe('User is logged in', () => {
    test('it should show the correct first letter for the Avatar when user is logged in', async () => {
        const {preloadedState: {auth}} = renderComponentWithProviderWhenAuthenticated(true, 'success', '/dashboard');

        const avatar = await screen.findByText(auth.user.firstName.charAt(0));

        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveClass('MuiAvatar-root MuiAvatar-circular');
    });

    test('it should show the correct options after searching the Autocomplete', async () => {
        const {preloadedState: {customer}} = renderComponentWithProviderWhenAuthenticated(true, 'success', '/customer-dashboard');

        const searchInput = screen.getByRole('combobox', {
            name: /search customers/i
        });

        expect(searchInput).toBeInTheDocument();

        await user.click(searchInput);
        await user.keyboard('users');

        for (const user of customer.customers) {
            const email = screen.getByRole('option', {
                name: user.email
            });

            expect(email).toBeInTheDocument();
        }
    });

    test('it should show change location to the customer-dashboard page when clicks select an option from Autocomplete after performing a search', async () => {
        const {history, preloadedState: {customer}} = renderComponentWithProviderWhenAuthenticated(true, 'success', '/customer-dashboard');

        const searchInput = screen.getByRole('combobox', {
            name: /search customers/i
        });

        expect(searchInput).toBeInTheDocument();

        await user.click(searchInput);
        await user.keyboard('users');

        const firstEmailOption = screen.getAllByRole('option')[0];

        await user.click(firstEmailOption);

        expect(history.location.pathname).toBe(`/customer-dashboard/${customer.customers[0].email}`)
    });

    test('it should show the dropdown menu along with its items when user clicks the IconButton', async () => {
        renderComponentWithProviderWhenAuthenticated(true, 'success', '/dashboard');

        const menuIconButton = screen.getByRole('button', {
            name: /account settings/i
        });

        await user.click(menuIconButton);

        const menuList = await screen.findByRole('menu');
        const menuItems = await screen.findAllByRole('menuitem');

        expect(menuList).toBeInTheDocument();
        expect(menuItems).toHaveLength(4);
    });

    test('it should change the location to the user profile page when user clicks on Profile menu item', async () => {
        const {history} = renderComponentWithProviderWhenAuthenticated(true, 'success', '/');

        const menuIconButton = screen.getByRole('button', {
            name: /account settings/i
        });

        await user.click(menuIconButton);

        const profileMenuItem = screen.getByRole('menuitem', {
            name: /profile/i
        });

        await user.click(profileMenuItem);

        expect(history.location.pathname).toBe('/profile');
    });

    test('it should log the user out when the user clicks the Logout menu item button', async () => {
        const {history} = renderComponentWithProviderWhenAuthenticated(true, 'success', '/dashboard');

        const menuIconButton = screen.getByRole('button', {
            name: /account settings/i
        });

        await user.click(menuIconButton);

        const logoutMenuItem = screen.getByRole('menuitem', {
            name: /logout/i
        });

        await user.click(logoutMenuItem);

        expect(history.location.pathname).toBe('/login');
    });
});