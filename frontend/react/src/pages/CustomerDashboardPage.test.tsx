import {describe, expect, test} from "vitest";
import {createServer} from "../test/server.ts";
import {Customer, IPreloadedState, ServerError} from "../types.ts";
import {renderWithProviders} from "../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import CustomerDashboardPage from "./CustomerDashboardPage.tsx";
import {screen, within} from "@testing-library/react";
import {createMemoryHistory, MemoryHistory} from "history";
import user from "@testing-library/user-event";

const mockEnqueue = vi.fn();

vi.mock('notistack', () => ({
    useSnackbar: vi.fn().mockImplementation(() => ({enqueueSnackbar: mockEnqueue}))
}));

const renderComponentWithProvider = async (query: string) => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: ['/customer-dashboard']});

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
            openActionsList: true
        },
        customer: {
            customers: [
                {
                    id: 1,
                    firstName: 'test',
                    lastName: 'users',
                    email: 'testusers@gmail.com',
                    age: 32,
                    gender: 'MALE',
                    profileImage: ''
                },
                {
                    id: 2,
                    firstName: 'dummy',
                    lastName: 'users',
                    email: 'dummyusers@gmail.com',
                    age: 42,
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
                query
            },
            customer: {} as Customer,
            actionType: '',
            status: 'success',
            error: {} as ServerError
        }
    };

    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <CustomerDashboardPage/>
        </Router>,
        {
            preloadedState
        }
    )

    // Handle the 'act' warning
    await screen.findByRole('button', {
        name: /account settings/i
    });

    return {
        history
    };
};

describe('User loads the CustomerDashboardPage', () => {
    const customers = [
        {
            id: 1,
            firstName: 'test',
            lastName: 'users',
            email: 'testusers@gmail.com',
            age: 32,
            gender: 'MALE',
            profileImage: null
        },
        {
            id: 2,
            firstName: 'dummy',
            lastName: 'users',
            email: 'dummyusers@gmail.com',
            age: 42,
            gender: 'MALE',
            profileImage: ''
        }
    ];

    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/page',
            statusCode: 200,
            res: () => {
                return {
                    customers,
                    currentPage: 0,
                    totalItems: 2,
                    totalPages: 1,
                    pageSize: 10,
                    sort: 'customer_id,ASC',
                    query: 'users'
                }
            }
        },
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers',
            statusCode: 200,
            res: () => {
                return customers;
            }
        }
    ]);

    test('it should show the correct breadcrumbs', async () => {
        await renderComponentWithProvider('');

        const breadcrumbTitles: string[] = [
            'Dashboard',
            'Customers'
        ];

        const breadcrumbList = within(screen.getByLabelText('breadcrumb')).getByRole('list');

        for (const breadcrumbTitle of breadcrumbTitles) {
            const breadcrumbListItem = within(breadcrumbList).getByText(breadcrumbTitle);
            expect(breadcrumbListItem).toBeInTheDocument();
        }
    });

    test('it should change location to the dashboard page when user clicks on the dashboard breadcrumb link', async () => {
        const {history} = await renderComponentWithProvider('');

        const homeBreadcrumbLink = within(screen.getByLabelText('breadcrumb')).getByRole('link', {
            name: /dashboard/i
        });

        await user.click(homeBreadcrumbLink);

        expect(history.location.pathname).toBe('/dashboard');
    });

    test('it should display the correct number of customer cards', async () => {
        await renderComponentWithProvider('users');

        const customerCards = screen.getAllByTestId('customer-card');
        const customersResult = screen.getByText(`Result: ${customerCards.length} customers were found`);
        const createCustomerButton = screen.getByRole('button', {
            name: /create/i
        });
        const paginationNavigation = screen.getByRole('navigation', {
            name: /pagination navigation/i
        });

        expect(customersResult).toBeInTheDocument();
        expect(createCustomerButton).toBeInTheDocument();
        expect(customerCards).toHaveLength(customers.length);
        expect(paginationNavigation).toBeInTheDocument();
    });

    test('it should contain the correct customer info for each customer-card', async () => {
        await renderComponentWithProvider('users');

        const customerCards = screen.getAllByTestId('customer-card');

        for (let i = 0; i < customerCards.length; i++) {
            const profileImage = within(customerCards[i]).getByRole('img');
            const fullName = within(customerCards[i]).getByText(`${customers[i].firstName} ${customers[i].lastName}`);
            const email = within(customerCards[i]).getByText(`${customers[i].email}`);
            const ageAndGender = within(customerCards[i])
                .getByText(`Age ${customers[i].age} | ${customers[i].gender.substring(0, 1) + customers[i].gender.substring(1).toLowerCase()}`);
            const updateButton = within(customerCards[i]).getByRole('button', {name: /update info/i});
            const deleteButton = within(customerCards[i]).getByRole('button', {name: /delete/i});

            expect(profileImage).toHaveAttribute('style', `background-image: url(${customers[i].profileImage != null ?
                'https://res.cloudinary.com/tonyhchao/image/upload' : '/src/assets/profile-background.jpg'});`)
            expect(fullName).toBeInTheDocument();
            expect(email).toBeInTheDocument();
            expect(ageAndGender).toBeInTheDocument();
            expect(updateButton).toBeInTheDocument();
            expect(deleteButton).toBeInTheDocument();
        }
    });

    test('it should update the page size', async () => {
        await renderComponentWithProvider('users');

        const pageSizeButton = screen.getByRole('button', {
            name: /size 10/i
        });

        await user.click(pageSizeButton);

        const pageSizeOption = screen.getByRole('option', {
            name: /50/i
        });

        await user.click(pageSizeOption);
    });

    test('it should change the page', async () => {
        await renderComponentWithProvider('users');

        const pageOneButton = screen.getByRole('button', {
            name: /page 1/i
        });

        await user.click(pageOneButton);
    });

    test('it should change location to the customer-form page when the create button is clicked', async () => {
        const {history} = await renderComponentWithProvider('users');

        const createCustomerButton = screen.getByRole('button', {
            name: /create/i
        });

        await user.click(createCustomerButton);

        expect(history.location.pathname).toBe('/customer-form');
    });

    test('it should change location to customer-form page with correct id when correct customer update button is clicked', async () => {
        const {history} = await renderComponentWithProvider('users');

        const firstCustomerCard = screen.getAllByTestId('customer-card')[0];
        const updateCustomerButton = within(firstCustomerCard).getByRole('button', {name: /update info/i});

        await user.click(updateCustomerButton);

        expect(history.location.pathname).toBe(`/customer-form/${customers[0].id}`);
    });
});

describe('User clicks on a customer delete button', () => {
    const customers = [
        {
            id: 1,
            firstName: 'test',
            lastName: 'users',
            email: 'testusers@gmail.com',
            age: 32,
            gender: 'MALE',
            profileImage: ''
        },
        {
            id: 2,
            firstName: 'dummy',
            lastName: 'users',
            email: 'dummyusers@gmail.com',
            age: 42,
            gender: 'MALE',
            profileImage: ''
        }
    ];

    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/page',
            statusCode: 200,
            res: () => {
                return {
                    customers,
                    currentPage: 0,
                    totalItems: 2,
                    totalPages: 1,
                    pageSize: 10,
                    sort: 'customer_id,ASC',
                    query: ''
                }
            }
        },
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers',
            statusCode: 200,
            res: () => {
                return customers;
            }
        },
        {
            method: 'delete',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 200,
            res: () => {
                return {};
            }
        }
    ]);

    test('it should show the delete dialog with correct information', async () => {
        await renderComponentWithProvider('');

        const firstCustomerCard = screen.getAllByTestId('customer-card')[0];
        const deleteCustomerButton = within(firstCustomerCard).getByRole('button', {name: /delete/i});

        await user.click(deleteCustomerButton);

        const deleteDialog = screen.getByRole('dialog', {
            name: /delete this customer\?/i
        });

        const deleteDialogTitle = screen.getByRole('heading', {
            name: /delete this customer\?/i
        });

        const deleteDialogContent = screen.getByText(
            new RegExp(`by clicking on agree, ${customers[0].firstName} ${customers[0].lastName} will be delete`, 'i')
        );

        const deleteDialogDisagreeButton = screen.getByRole('button', {
            name: /disagree/i
        });

        const deleteDialogAgreeButton = screen.getByRole('button', {
            name: 'Agree'
        });

        expect(deleteDialog).toBeInTheDocument();
        expect(deleteDialogTitle).toBeInTheDocument();
        expect(deleteDialogContent).toBeInTheDocument();
        expect(deleteDialogDisagreeButton).toBeInTheDocument();
        expect(deleteDialogAgreeButton).toBeInTheDocument();
    });

    test('it should not delete the specified customer when user clicks on the Disagree button', async () => {
        await renderComponentWithProvider('');

        const firstCustomerCard = screen.getAllByTestId('customer-card')[0];
        const deleteCustomerButton = within(firstCustomerCard).getByRole('button', {name: /delete/i});

        await user.click(deleteCustomerButton);

        const deleteDialogDisagreeButton = screen.getByRole('button', {
            name: /disagree/i
        });

        await user.click(deleteDialogDisagreeButton);

        // Handle the 'act' warning to update the openDialog state from CustomerItem component
        await screen.findByRole('button', {
            name: /account settings/i
        });

        const deleteDialog = screen.queryByRole('dialog', {
            name: /delete this customer\?/i
        });

        expect(deleteDialog).not.toBeInTheDocument();
    });

    test('it should delete the specified customer when user clicks on the Agree button', async () => {
        await renderComponentWithProvider('');

        const firstCustomerCard = screen.getAllByTestId('customer-card')[0];
        const deleteCustomerButton = within(firstCustomerCard).getByRole('button', {name: /delete/i});

        await user.click(deleteCustomerButton);

        const deleteDialogAgreeButton = screen.getByRole('button', {
            name: 'Agree'
        });

        await user.click(deleteDialogAgreeButton);

        // Handle the 'act' warning to update the openDialog state from CustomerItem component
        await screen.findByRole('button', {
            name: /account settings/i
        });

        const deleteDialog = screen.queryByRole('dialog', {
            name: /delete this customer\?/i
        });

        expect(deleteDialog).not.toBeInTheDocument();
        expect(mockEnqueue).toHaveBeenCalledWith('Customer was deleted successfully', {'variant': 'success'});
    })
});