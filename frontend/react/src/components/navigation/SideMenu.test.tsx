import {describe, expect, test} from "vitest";
import {renderWithProviders} from "../../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import SideMenu from "./SideMenu.tsx";
import {Customer, CustomerPage, IPreloadedState, ServerError} from "../../types.ts";
import {screen} from "@testing-library/react";
import user from "@testing-library/user-event";
import {createMemoryHistory, MemoryHistory} from "history";

const renderComponentWithProvider = (initialRoute: string) => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: [initialRoute]});

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
            actionType: '',
            status: 'success',
            error: {} as ServerError
        }
    };

    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <SideMenu/>
        </Router>,
        {
            preloadedState
        }
    )

    return {
        history
    };
}

describe('When the SideMenu component is loaded', () => {
    test('it should show a list of buttons when user clicks on the actions button', async () => {
        const openActionListButtonLabels: string[] = [
            'Customer',
            'Dashboard',
            'Profile',
            'Settings'
        ];

        renderComponentWithProvider('/dashboard');

        const sideMenuActionsButton = screen.getByRole('button', {
            name: /actions customers, dashboard, profile, settings/i
        });

        expect(sideMenuActionsButton).toBeInTheDocument();

        await user.click(sideMenuActionsButton);

        for (const buttonLabel of openActionListButtonLabels) {
            const openActionListButton = screen.getByRole('button', {
                name: buttonLabel
            });

            expect(openActionListButton).toBeInTheDocument();
        }
    });

    test('it should change the location to the dashboard page when Home button is clicked', async () => {
        const {history} = renderComponentWithProvider('/profile');

        const sideMenuHomeButton = screen.getByRole('button', {
            name: /home/i
        });

        expect(sideMenuHomeButton).toBeInTheDocument();

        await user.click(sideMenuHomeButton);

        expect(history.location.pathname).toBe('/dashboard');
    });

    test('it should change the location to the customer-dashboard page when Customer button is clicked', async () => {
        const {history} = renderComponentWithProvider('/dashboard');

        const sideMenuActionsButton = screen.getByRole('button', {
            name: /actions customers, dashboard, profile, settings/i
        });

        await user.click(sideMenuActionsButton);

        const customerButton = screen.getByRole('button', {
            name: 'Customer'
        });

        await user.click(customerButton);

        expect(history.location.pathname).toBe('/customer-dashboard');
    });

    test('it should open the inbox list when the inbox list button is clicked', async () => {
        renderComponentWithProvider('/dashboard');

        const inboxIconButton = screen.getByTestId('MoveToInboxIcon');

        await user.click(inboxIconButton);

        const inboxListItem = screen.getByRole('button', {
            name: /starred/i
        });

        expect(inboxListItem).toBeInTheDocument();
    });

    test('it should change location to the dashboard page when user clicks on the starred button', async () => {
        const {history} = renderComponentWithProvider('/profile');

        const inboxIconButton = screen.getByTestId('MoveToInboxIcon');

        await user.click(inboxIconButton);

        const inboxListItem = screen.getByRole('button', {
            name: /starred/i
        });

        await user.click(inboxListItem);

        expect(history.location.pathname).toBe('/dashboard');
    });

    test('it should show a link to the project GitHub page', () => {
        renderComponentWithProvider("/dashboard");

        const githubLink = screen.getByRole('link', {
            name: /github/i
        });

        expect(githubLink).toBeInTheDocument();
        expect(githubLink).toHaveAttribute('href', 'https://github.com/TonyHC/spring-boot-fullstack')
    });
});