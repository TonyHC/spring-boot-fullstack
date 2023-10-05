import {describe, expect} from "vitest";
import {renderWithProviders} from "../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import DashboardHomePage from "./DashboardHomePage.tsx";
import {createServer} from "../test/server.ts";
import {screen, within} from "@testing-library/react";
import {Customer, IPreloadedState, ServerError} from "../types.ts";
import {createMemoryHistory, MemoryHistory} from "history";
import user from "@testing-library/user-event";

// Mock react-apexcharts library
vi.mock('react-apexcharts', () => {
    return {
        __esModule: true,
        default: () => {
            return <div/>
        },
    }
});

const renderComponentWithProvider = async () => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: ['/dashboard']});

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
            openActionsList: true
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
            status: 'success',
            error: {} as ServerError
        }
    };

    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <DashboardHomePage/>
        </Router>,
        {
            preloadedState
        }
    );

    // Wait for customers information to load
    await screen.findByRole('heading', {
        name: /recent customers/i
    });

    return {
        history
    };
};

describe('User loads the DashboardHomePage', () => {
    const customers: Customer[] = [
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
            lastName: 'Account',
            email: 'dummyaccount@gmail.com',
            age: 42,
            gender: 'FEMALE',
            profileImage: ''
        }
    ];

    const currentDate: string = new Date().toJSON().slice(0, 10);

    createServer([
        {
            path: 'http://localhost:8080/api/v1/customers',
            statusCode: 200,
            res: () => {
                return customers;
            }
        }
    ]);

    test('it should show the correct breadcrumbs', async () => {
        await renderComponentWithProvider();

        const breadcrumbTitles: string[] = [
            'Home'
        ];

        const breadcrumbList = within(screen.getByLabelText('breadcrumb')).getByRole('list');

        for (const breadcrumbTitle of breadcrumbTitles) {
            const breadcrumbListItem = within(breadcrumbList).getByText(breadcrumbTitle);
            expect(breadcrumbListItem).toBeInTheDocument();
        }
    });

    test('it should show the correct total customer information', async () => {
        await renderComponentWithProvider();

        const totalCustomerTitle = within(screen.getByTestId('total-customers')).getByRole('heading', {
            name: /total customers/i
        });

        const totalCustomerCount = within(screen.getByTestId('total-customers')).getByText(customers.length);

        const customerGenderRatioDate = within(screen.getByTestId('customer-gender-ratio')).getByText(`on ${currentDate}`);

        expect(totalCustomerTitle).toBeInTheDocument();
        expect(totalCustomerCount).toBeInTheDocument();
        expect(customerGenderRatioDate).toBeInTheDocument();
    });

    test('it should show the correct customer ratio information', async () => {
        await renderComponentWithProvider();

        const customerGenderRatioTitle = within(screen.getByTestId('customer-gender-ratio')).getByRole('heading', {
            name: /ratio \(m\/ f\)/i
        });

        const males: Customer[] = customers.filter(customer => customer.gender === "MALE");
        const females: Customer[] = customers.filter(customer => customer.gender === "FEMALE");
        const ratio = (males.length / females.length).toFixed(2);
        const customerGenderRatio = within(screen.getByTestId('customer-gender-ratio')).getByText(ratio);

        const customerGenderRatioDate = within(screen.getByTestId('customer-gender-ratio')).getByText(`on ${currentDate}`);

        expect(customerGenderRatioTitle).toBeInTheDocument();
        expect(customerGenderRatio).toBeInTheDocument();
        expect(customerGenderRatioDate).toBeInTheDocument();
    });

    test('it should show a table displaying all the customer information', async () => {
        await renderComponentWithProvider();

        const customerTableTitle = screen.getByRole('heading', {
            name: /recent customers/i
        });

        const customerTableRows = within(screen.getByTestId('customers')).getAllByRole('row');

        const customerTableLink = screen.getByRole('link', {
            name: /see more customers/i
        });

        expect(customerTableTitle).toBeInTheDocument();

        for (let i = 0; i < customerTableRows.length; i++) {
            const idCell = screen.getByRole('cell', {
                name: customers[i].id.toString()
            });

            const firstNameCell = screen.getByRole('cell', {
                name: customers[i].firstName
            });

            const lastNameCell = screen.getByRole('cell', {
                name: customers[i].lastName
            });

            const emailCell = screen.getByRole('cell', {
                name: customers[i].email
            });

            const ageCell = screen.getByRole('cell', {
                name: customers[i].age.toString()
            });

            const genderCell = screen.getByRole('cell', {
                name: customers[i].gender
            });

            expect(idCell).toBeInTheDocument();
            expect(firstNameCell).toBeInTheDocument();
            expect(lastNameCell).toBeInTheDocument();
            expect(emailCell).toBeInTheDocument();
            expect(ageCell).toBeInTheDocument();
            expect(genderCell).toBeInTheDocument();
        }

        expect(customerTableLink).toBeInTheDocument();
        expect(customerTableLink).toHaveAttribute('href', '/customer-dashboard');
        expect(customerTableLink).toHaveClass('table-link');
    });

    test('it should change the location to the customer-dashboard page when user clicks on the See more customers link', async () => {
        const {history} = await renderComponentWithProvider();

        const customerTableLink = screen.getByRole('link', {
            name: /see more customers/i
        });

        await user.click(customerTableLink);

        expect(history.location.pathname).toBe('/customer-dashboard');
    });
});