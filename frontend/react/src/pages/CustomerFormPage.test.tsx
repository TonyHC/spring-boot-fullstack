import {createMemoryHistory, MemoryHistory} from "history";
import {Customer, IPreloadedState, ServerError, User} from "../types.ts";
import {renderWithProviders} from "../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import CustomerFormPage from "./CustomerFormPage.tsx";
import {screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";
import {createServer} from "../test/server.ts";
import user from "@testing-library/user-event";
import routeData from "react-router";

const mockEnqueue = vi.fn();

vi.mock('notistack', () => ({
    useSnackbar: vi.fn().mockImplementation(() => ({enqueueSnackbar: mockEnqueue}))
}));

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
            customerPage: {
                customers: [],
                currentPage: 0,
                totalItems: 1,
                totalPages: 1,
                pageSize: 10,
                sort: 'customer_id,ASC',
                query: ''
            },
            customer: {} as Customer,
            actionType: '',
            status: 'idle',
            error: {} as ServerError
        }
    };

    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <CustomerFormPage/>
        </Router>,
        {
            preloadedState
        }
    );

    return {
        history
    };
};

const renderComponentWithProviderWhenAuthenticated = async (initialRoute: string) => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: [initialRoute]});

    const preloadedState: IPreloadedState = {
        auth: {
            isAuth: true,
            user: {
                id: 2,
                firstName: 'Dummy',
                lastName: 'Users',
                email: 'dummyusers@gmail.com',
                age: 58,
                gender: 'MALE',
                profileImage: '',
                roles: ['USER_ROLE'],
                username: 'dummyusers@gmail.com'
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
                    age: 58,
                    gender: 'MALE',
                    profileImage: ''
                }
            ],
            customerPage: {
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
                        age: 58,
                        gender: 'MALE',
                        profileImage: ''
                    }
                ],
                currentPage: 0,
                totalItems: 1,
                totalPages: 1,
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
            <CustomerFormPage/>
        </Router>,
        {
            preloadedState
        }
    );

    // Handle the 'act' warning
    await screen.findByRole('button', {
        name: /account settings/i
    });

    return {
        preloadedState,
        history
    }
};

describe('User clicks the Sign in link from the create customer form', () => {
    test('it should load the login page', async () => {
        const {history} = renderComponentWithProviderWhenNotAuthenticated('/sign-up');

        const signInLink = screen.getByRole('link', {
            name: /sign in/i
        });

        await user.click(signInLink);

        expect(signInLink).toBeInTheDocument();
        expect(signInLink).toHaveAttribute('href', '/login')
        expect(history.location.pathname).toBe('/login');
    });
});

describe('User loads the CustomerFormPage from the /customer-form-route', () => {
    createServer([
        {
            method: 'post',
            path: 'http://localhost:8080/api/v1/customers',
            statusCode: 200,
            res: () => {
                return {}
            }
        }
    ]);

    test('it should contain the create customer form', async () => {
        await renderComponentWithProviderWhenAuthenticated('/customer-form');

        const customerFormTitle = screen.getByRole('heading', {
            name: /create customer/i
        });

        const firstNameInput = screen.getByRole('textbox', {
            name: /first name/i
        });

        const lastNameInput = screen.getByRole('textbox', {
            name: /last name/i
        });

        const emailInput = screen.getByRole('textbox', {
            name: /email/i
        });

        const passwordInput = screen.getByLabelText(/password/i);

        const ageInput = screen.getByRole('spinbutton', {
            name: /age/i
        });

        const genderSelectButton = screen.getByRole('button', {
            name: /gender/i
        });

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        expect(customerFormTitle).toBeInTheDocument();
        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(ageInput).toBeInTheDocument();
        expect(genderSelectButton).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    test('it should select the FEMALE option from the gender select', async () => {
        await renderComponentWithProviderWhenAuthenticated('/customer-form');

        const genderSelectButton = screen.getByRole('button', {
            name: /gender/i
        });

        await user.click(genderSelectButton);

        const option = screen.getByRole('option', {
            name: /female/i
        });

        await user.click(option);

        const updatedGenderSelectButton = screen.getByRole('button', {
            name: /gender female/i
        });

        expect(updatedGenderSelectButton).toBeInTheDocument();
    });

    test('it should create new customer successfully', async () => {
        const {history} = await renderComponentWithProviderWhenAuthenticated('/customer-form');

        const firstNameInput = screen.getByRole('textbox', {
            name: /first name/i
        });

        await user.click(firstNameInput);
        await user.keyboard('Dummy');

        const lastNameInput = screen.getByRole('textbox', {
            name: /last name/i
        });

        await user.click(lastNameInput);
        await user.keyboard('Users');

        const emailInput = screen.getByRole('textbox', {
            name: /email/i
        });

        await user.click(emailInput);
        await user.keyboard('dummyusers@mail.com');

        const passwordInput = screen.getByLabelText(/password/i);

        await user.click(passwordInput);
        await user.keyboard('password');

        const ageInput = screen.getByRole('spinbutton', {
            name: /age/i
        });

        await user.clear(ageInput);
        await user.keyboard('29');

        const genderSelectButton = screen.getByRole('button', {
            name: /gender/i
        });

        await user.click(genderSelectButton);

        const genderSelectOption = screen.getByRole('option', {
            name: /female/i
        });

        await user.click(genderSelectOption);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(submitButton);

        expect(history.location.pathname).toBe('/customer-dashboard');
    });

    test('it should show the form validations errors when user submits an empty form', async () => {
        const formValidationsErrorMessages = [
            'First name',
            'Last name',
            'Email',
            'Password',
            'Gender'
        ];

        await renderComponentWithProviderWhenAuthenticated('/customer-form');

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(submitButton);

        for (const errorMessage of formValidationsErrorMessages) {
            const inputValidationErrorMessage = screen.getByText(new RegExp(`${errorMessage} is required`, 'i'));

            expect(inputValidationErrorMessage).toBeInTheDocument();
        }
    })
});

describe('User submits the create customer form with an already used email', () => {
    createServer([
        {
            method: 'post',
            path: 'http://localhost:8080/api/v1/customers',
            statusCode: 409,
            res: () => {
                return {
                    timestamp: '2023-09-03T21:08:45.2748216',
                    statusCode: 409,
                    message: 'Email already taken',
                    path: '/api/v1/customers'
                };
            }
        }
    ]);

    test('it should show correct error message alert', async () => {
        await renderComponentWithProviderWhenAuthenticated('/customer-form');

        const firstNameInput = screen.getByRole('textbox', {
            name: /first name/i
        });

        const lastNameInput = screen.getByRole('textbox', {
            name: /last name/i
        });

        const emailInput = screen.getByRole('textbox', {
            name: /email/i
        });

        const passwordInput = screen.getByLabelText(/password/i);

        const ageInput = screen.getByRole('spinbutton', {
            name: /age/i
        });

        const genderSelectButton = screen.getByRole('button', {
            name: /gender/i
        });

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(firstNameInput);
        await user.keyboard('Dummy');

        await user.click(lastNameInput);
        await user.keyboard('Users');

        await user.click(emailInput);
        await user.keyboard('dummyusers@mail.com');

        await user.click(passwordInput);
        await user.keyboard('password');

        await user.click(ageInput);
        await user.clear(ageInput);
        await user.keyboard('29');

        await user.click(genderSelectButton);

        const genderSelectOption = screen.getByRole('option', {
            name: /female/i
        });

        await user.click(genderSelectOption);

        await user.click(submitButton);

        const alertErrorMessage = screen.getByRole('alert');
        const createCustomerFormErrorMessage = screen.getByText(/email already taken/i);

        expect(alertErrorMessage).toBeInTheDocument();
        expect(createCustomerFormErrorMessage).toBeInTheDocument();
        expect(createCustomerFormErrorMessage).toHaveClass('MuiAlert-message');
    });
});

describe('User loads the CustomerFormPage containing the update customer form', () => {
    const customer: Customer = {
        id: 1,
        firstName: 'Test',
        lastName: 'Users',
        email: 'testusers@gmail.com',
        age: 32,
        gender: 'MALE',
        profileImage: ''
    };

    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 200,
            res: () => {
                return customer;
            }
        },
        {
            method: 'post',
            path: 'http://localhost:8080/api/v1/customers/1/profile-image',
            statusCode: 200,
            res: () => {
                return {};
            }
        },
        {
            method: 'patch',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 200,
            res: () => {
                return {};
            }
        }
    ]);

    test('it should show the update customer form populated with the correct customer information', async () => {
        vi.spyOn(routeData, 'useParams').mockReturnValue({customerId: customer.id.toString()});

        await renderComponentWithProviderWhenAuthenticated(`/customer-form/${customer.id}`);

        const customerProfileImage = screen.getByRole('img', {
            name: /profile image/i
        });
        const uploadImageDropZone = screen.getByTestId('dropzone');
        const uploadImageDropZoneText = screen.getByText(/drag 'n' drop picture here, or click to select picture/i);
        const firstNameInput = screen.getByDisplayValue(customer.firstName);
        const lastNameInput = screen.getByDisplayValue(customer.lastName);
        const emailInput = screen.getByDisplayValue(customer.email);
        const ageInput = screen.getByDisplayValue(customer.age);
        const genderSelect = screen.getByText(new RegExp(customer.gender, 'i'));

        expect(customerProfileImage).toBeInTheDocument();
        expect(uploadImageDropZone).toBeInTheDocument();
        expect(uploadImageDropZoneText).toBeInTheDocument();
        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(ageInput).toBeInTheDocument();
        expect(genderSelect).toBeInTheDocument();
    });

    test('it should the update customer successfully and display a success toast', async () => {
        vi.spyOn(routeData, 'useParams').mockReturnValue({customerId: customer.id.toString()});

        const {history} = await renderComponentWithProviderWhenAuthenticated(`/customer-form/${customer.id}`);

        const ageInput = screen.getByDisplayValue(customer.age);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(ageInput);
        await user.clear(ageInput);
        await user.keyboard('41');

        await user.click(submitButton);

        expect(history.location.pathname).toBe('/customer-dashboard');
        expect(mockEnqueue).toHaveBeenCalledWith('Customer was updated successfully', {'variant': 'success'});
    });

    test('it should upload the profile image successfully', async () => {
        vi.spyOn(routeData, 'useParams').mockReturnValue({customerId: customer.id.toString()});
        const file: File = new File(["image"], "profile.png", {type: "image/png"});

        const {history} = await renderComponentWithProviderWhenAuthenticated(`/customer-form/${customer.id}`);

        const uploadImageDropZone = screen.getByTestId('dropzone');

        await user.upload(uploadImageDropZone, file);

        expect(history.location.pathname).toBe('/customer-dashboard');
        expect(mockEnqueue).toHaveBeenCalledWith('Upload profile image was successfully', {'variant': 'success'});
    });
});

describe('User loads the CustomerFormPage from the /profile/:customerId route', () => {
    const customer: Customer = {
        id: 2,
        firstName: 'Dummy',
        lastName: 'Users',
        email: 'dummyusers@gmail.com',
        age: 58,
        gender: 'MALE',
        profileImage: ''
    };

    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 200,
            res: () => {
                return customer;
            }
        },
        {
            method: 'patch',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 200,
            res: () => {
                return {};
            }
        }
    ]);

    test('it should load the update customer form with the correct authenticated user information', async () => {
        vi.spyOn(routeData, 'useParams').mockReturnValue({customerId: customer.id.toString()});

        const {preloadedState: {auth}} = await renderComponentWithProviderWhenAuthenticated(`/profile/${customer.id}`);

        const customerProfileImage = screen.getByRole('img', {
            name: /profile image/i
        });
        const firstNameInput = screen.getByDisplayValue(auth.user.firstName);
        const lastNameInput = screen.getByDisplayValue(auth.user.lastName);
        const emailInput = screen.getByDisplayValue(auth.user.email);
        const ageInput = screen.getByDisplayValue(auth.user.age);
        const genderSelect = screen.getByText(new RegExp(auth.user.gender, 'i'));

        expect(customerProfileImage).toBeInTheDocument();
        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(ageInput).toBeInTheDocument();
        expect(genderSelect).toBeInTheDocument();
    });

    test('it should update the logged in customer profile information successfully and display a success toast', async () => {
        vi.spyOn(routeData, 'useParams').mockReturnValue({customerId: customer.id.toString()});

        const {
            preloadedState: {auth},
            history
        } = await renderComponentWithProviderWhenAuthenticated(`/profile/${customer.id}`);

        const lastNameInput = screen.getByDisplayValue(auth.user.lastName);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(lastNameInput);
        await user.clear(lastNameInput);
        await user.keyboard('Tester');

        await user.click(submitButton);

        expect(history.location.pathname).toBe('/profile');
        expect(mockEnqueue).toHaveBeenCalledWith('Customer was updated successfully', {'variant': 'success'});
    })
});

describe('User submits the update customer form with already used email', () => {
    const customer: Customer = {
        id: 1,
        firstName: 'Test',
        lastName: 'Users',
        email: 'testusers@gmail.com',
        age: 32,
        gender: 'MALE',
        profileImage: ''
    };

    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 200,
            res: () => {
                return customer;
            }
        },
        {
            method: 'patch',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 409,
            res: () => {
                return {
                    timestamp: '2023-09-03T21:08:45.2748216',
                    statusCode: 409,
                    message: 'Email already taken',
                    path: '/api/v1/customers/1'
                };
            }
        }
    ]);

    test('it should show correct error message alert', async () => {
        vi.spyOn(routeData, 'useParams').mockReturnValue({customerId: customer.id.toString()});

        await renderComponentWithProviderWhenAuthenticated(`/customer-form/${customer.id}`);

        const emailInput = screen.getByDisplayValue(customer.email);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(emailInput);
        await user.clear(emailInput);
        await user.keyboard('dummyusers@mail.com');

        await user.click(submitButton);

        const alertErrorMessage = screen.getByRole('alert');
        const createCustomerFormErrorMessage = screen.getByText(/email already taken/i);

        expect(alertErrorMessage).toBeInTheDocument();
        expect(createCustomerFormErrorMessage).toBeInTheDocument();
        expect(createCustomerFormErrorMessage).toHaveClass('MuiAlert-message');
    });
});

describe('User submits the update customer form with no changes made', () => {
    const customer: Customer = {
        id: 1,
        firstName: 'Test',
        lastName: 'Users',
        email: 'testusers@gmail.com',
        age: 32,
        gender: 'MALE',
        profileImage: ''
    };

    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 200,
            res: () => {
                return customer;
            }
        },
        {
            method: 'patch',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 400,
            res: () => {
                return {
                    timestamp: '2023-09-03T21:08:45.2748216',
                    statusCode: 400,
                    message: 'No changes were found',
                    path: '/api/v1/customers/1'
                };
            }
        }
    ]);

    test('it should show correct error message alert', async () => {
        vi.spyOn(routeData, 'useParams').mockReturnValue({customerId: customer.id.toString()});

        await renderComponentWithProviderWhenAuthenticated(`/customer-form/${customer.id}`);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(submitButton);

        const alertErrorMessage = screen.getByRole('alert');
        const createCustomerFormErrorMessage = screen.getByText(/no changes were found/i);

        expect(alertErrorMessage).toBeInTheDocument();
        expect(createCustomerFormErrorMessage).toBeInTheDocument();
        expect(createCustomerFormErrorMessage).toHaveClass('MuiAlert-message');
    });
});

describe('User tries to access update customer form with an invalid id', () => {
    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/:customerId',
            statusCode: 404,
            res: () => {
                return {
                    timestamp: '2023-09-01T09:09:25.0664291',
                    statusCode: 404,
                    message: 'Customer with id [141] was not found',
                    path: '/api/v1/customers/141'
                };
            }
        }
    ]);

    test('it should the change location to the not found page', async () => {
        vi.spyOn(routeData, 'useParams').mockReturnValue({customerId: '141'});

        const {history} = await renderComponentWithProviderWhenAuthenticated('/customer-form/141');

        expect(history.location.pathname).toBe('/not-found')
    });
});