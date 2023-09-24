import {describe, expect, test} from "vitest";
import {Customer, IPreloadedState, ServerError} from "../types.ts";
import {renderWithProviders} from "../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import UserProfilePage from "./UserProfilePage.tsx";
import {screen, within} from "@testing-library/react";
import {createServer} from "../test/server.ts";
import user from "@testing-library/user-event";
import {createMemoryHistory, MemoryHistory} from "history";

const mockEnqueue = vi.fn();

vi.mock('notistack', () => ({
    useSnackbar: vi.fn().mockImplementation(() => ({enqueueSnackbar: mockEnqueue}))
}));

const renderComponentWithProvider = async (hasProfileImage: boolean) => {
    const history: MemoryHistory = createMemoryHistory({initialEntries: ['/profile']});

    const preloadedState: IPreloadedState = {
        auth: {
            isAuth: true,
            user: {
                id: 1,
                firstName: 'Test',
                lastName: 'Users',
                email: 'testusers@mail.com',
                age: 32,
                gender: 'MALE',
                profileImage: hasProfileImage ? '' : null,
                roles: ['ROLE_USER'],
                username: 'testusers@mail.com'
            },
            status: 'success',
            error: {} as ServerError,
            openActionsList: false
        },
        customer: {
            customers: [],
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
            <UserProfilePage/>
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
        preloadedState,
        history
    };
}

describe('User loads the UserProfilePage', () => {
    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/email/:email',
            statusCode: 200,
            res: () => {
                return {
                    id: 1,
                    firstName: 'Test',
                    lastName: 'Users',
                    email: 'testusers@mail.com',
                    age: 32,
                    gender: 'MALE',
                    profileImage: '',
                    roles: ['ROLE_USER'],
                    username: 'testusers@mail.com'
                }
            }
        }
    ]);

    test('it should show the correct breadcrumbs', async () => {
        await renderComponentWithProvider(true);

        const breadcrumbTitles: string[] = [
            'Home',
            'User Profile'
        ];

        const breadcrumbList = within(screen.getByLabelText('breadcrumb')).getByRole('list');

        for (const breadcrumbTitle of breadcrumbTitles) {
            const breadcrumbListItem = within(breadcrumbList).getByText(breadcrumbTitle);
            expect(breadcrumbListItem).toBeInTheDocument();
        }
    });

    test('it should change location to the dashboard page when user clicks on the home breadcrumb link', async () => {
        const {history} = await renderComponentWithProvider(true);

        const homeBreadcrumbLink = within(screen.getByLabelText('breadcrumb')).getByRole('link', {
            name: /home/i
        });

        await user.click(homeBreadcrumbLink);

        expect(history.location.pathname).toBe('/dashboard');
    });

    test('it should show the correct information for the Accordion User Details section', async () => {
        const {preloadedState: {auth}} = await renderComponentWithProvider(true);

        const name = screen.getByText(`Name: ${auth.user.firstName} ${auth.user.lastName}`);
        const email = screen.getByText(`Email: ${auth.user.email}`);
        const age = screen.getByText(`Age: ${auth.user.age}`);
        const gender = screen.getByText(`Gender: ${auth.user.gender}`);

        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(age).toBeInTheDocument();
        expect(gender).toBeInTheDocument();
    });

    test('it should show the correct Accordion panel expanded when clicking the appropriate panel button', async () => {
        await renderComponentWithProvider(true);

        const userDetailsButton = screen.getByRole('button', {
            name: /user details/i
        });

        const securityDetailsButton = screen.getByRole('button', {
            name: /security details/i
        });

        expect(userDetailsButton).toHaveAttribute('aria-expanded', "true");
        expect(securityDetailsButton).toHaveAttribute('aria-expanded', "false");

        await user.click(securityDetailsButton);

        expect(userDetailsButton).toHaveAttribute('aria-expanded', "false");
        expect(securityDetailsButton).toHaveAttribute('aria-expanded', "true");
    });

    test('it should show the correct information for the Accordion Security Details section', async () => {
        const {preloadedState: {auth}} = await renderComponentWithProvider(true);

        const securityDetailsButton = screen.getByRole('button', {
            name: /security details/i
        });

        await user.click(securityDetailsButton);

        const username = screen.getByText(`Username: ${auth.user.username}`);
        const roles = screen.getByText(`Roles: ${auth.user.roles[0]}`);

        expect(username).toBeInTheDocument();
        expect(roles).toBeInTheDocument();
    });

    test('it should show the tablist and its tabs', async () => {
        const tabNames = [
            'Profile Image',
            'Upload Image',
            'Update User',
            'Reset Password'
        ];

        await renderComponentWithProvider(false);

        const tablist = screen.getByRole('tablist', {
            name: /basic tabs example/i
        });

        expect(tablist).toBeInTheDocument();

        for (const tabName of tabNames) {
            const tab = screen.getByRole('tab', {
                name: tabName
            });

            expect(tab).toBeInTheDocument();
        }
    });

    test('it should show the default tab and its panel when this page is rendered', async () => {
        await renderComponentWithProvider(true);

        const defaultTabPanel = screen.getByRole('tabpanel', {
            name: /profile image/i
        });

        const userImage = screen.getByRole('img', {
            name: /profile-image/i
        });

        const userFullName = within((defaultTabPanel)).getByText(/test users/i);

        const userEmail = within((defaultTabPanel)).getByText(/testusers@mail.com/i);

        const uploadButton = screen.getByRole('button', {
            name: /upload image/i
        });

        expect(userImage).toBeInTheDocument();
        expect(userFullName).toBeInTheDocument();
        expect(userEmail).toBeInTheDocument();
        expect(uploadButton).toBeInTheDocument();
    });

    test('it should change to the Upload Image tab when user clicks on the upload image button', async () => {
        await renderComponentWithProvider(false);

        const uploadButton = screen.getByRole('button', {
            name: /upload image/i
        });

        await user.click(uploadButton);

        const uploadImageDropZone = screen.getByText(/drag 'n' drop picture here, or click to select picture/i);

        expect(uploadImageDropZone).toBeInTheDocument();
    });

    test('it should show the Upload Image tab and its panel when clicked', async () => {
        await renderComponentWithProvider(false);

        const uploadImageTab = screen.getByRole('tab', {
            name: /upload image/i
        });

        await user.click(uploadImageTab);

        const uploadImageDropZone = screen.getByTestId('dropzone');
        const uploadImageDropZoneText = screen.getByText(/drag 'n' drop picture here, or click to select picture/i);

        expect(uploadImageDropZone).toBeInTheDocument();
        expect(uploadImageDropZoneText).toBeInTheDocument();
    });

    test('it should show the Update User tab and its panel when clicked', async () => {
        await renderComponentWithProvider(false);

        const updateUserTab = screen.getByRole('tab', {
            name: /update user/i
        });

        await user.click(updateUserTab);

        const updateUserButton = screen.getByRole('button', {
            name: /update information/i
        });

        expect(updateUserButton).toBeInTheDocument();
    });

    test('it should change the location the customer form when update user button is clicked', async () => {
        const {history, preloadedState: {auth}} = await renderComponentWithProvider(false);

        const updateUserTab = screen.getByRole('tab', {
            name: /update user/i
        });

        await user.click(updateUserTab);

        const updateUserButton = screen.getByRole('button', {
            name: /update information/i
        });

        await user.click(updateUserButton);

        expect(history.location.pathname).toBe(`/profile/${auth.user.id}`);
    });

    test('it should show the Reset Password tab and its panel when clicked', async () => {
        await renderComponentWithProvider(false);

        const resetPasswordTab = screen.getByRole('tab', {
            name: /reset password/i
        })

        await user.click(resetPasswordTab);

        const resetPasswordFormTitle = screen.getByRole('heading', {
            name: /reset password/i
        });

        const passwordInput = screen.getByLabelText('Password');

        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        expect(resetPasswordFormTitle).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    test('it should contain a disabled submit button if form inputs are invalid', async () => {
        await renderComponentWithProvider(false);

        const resetPasswordTab = screen.getByRole('tab', {
            name: /reset password/i
        })

        await user.click(resetPasswordTab);

        const passwordInput = screen.getByLabelText('Password');

        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(passwordInput);
        await user.keyboard('passwords');

        await user.click(confirmPasswordInput);
        await user.keyboard('next');

        expect(submitButton).toBeDisabled();
    });
});

describe('User tries to upload a profile image', () => {
    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/email/:email',
            statusCode: 200,
            res: () => {
                return {
                    id: 1,
                    firstName: 'Test',
                    lastName: 'Users',
                    email: 'testusers@mail.com',
                    age: 32,
                    gender: 'MALE',
                    profileImage: '',
                    roles: ['ROLE_USER'],
                    username: 'testusers@mail.com'
                }
            }
        },
        {
            method: 'post',
            path: 'http://localhost:8080/api/v1/customers/:customerId/profile-image',
            statusCode: 200,
            res: () => {
                return {}
            }
        }
    ]);

    // Image upload via react-dropzone testing: https://stackoverflow.com/questions/64587566/how-to-test-react-dropzone-with-jest-and-react-testing-library
    test('it should succeed when user selects and uploads a image via their file system', async () => {
        const file: File = new File(["image"], "profile.png", {type: "image/png"});

        const {history} = await renderComponentWithProvider(false);

        const uploadImageTab = screen.getByRole('tab', {
            name: /upload image/i
        });

        await user.click(uploadImageTab);

        const imageDropZone = screen.getByTestId('dropzone');

        await user.upload(imageDropZone, file);

        expect(history.location.pathname).toBe('/profile');
        expect(mockEnqueue).toHaveBeenCalledWith('Upload profile image was successfully', {'variant': 'success'});
        expect(((imageDropZone) as HTMLInputElement).files).toHaveLength(1);
        expect(((imageDropZone) as HTMLInputElement).files![0]).toStrictEqual(file);
    });
});

describe('User submits a mismatching and all uppercase inputs from the Reset Password form', () => {
    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/email/:email',
            statusCode: 200,
            res: () => {
                return {
                    id: 1,
                    firstName: 'Test',
                    lastName: 'Users',
                    email: 'testusers@mail.com',
                    age: 32,
                    gender: 'MALE',
                    profileImage: '',
                    roles: ['ROLE_USER'],
                    username: 'testusers@mail.com'
                }
            }
        },
        {
            method: 'patch',
            path: 'http://localhost:8080/api/v1/customers/:customerId/reset-password',
            statusCode: 400,
            res: () => {
                return {
                    timestamp: '2023-09-01T09:09:25.0664291',
                    statusCode: 400,
                    message: 'Passwords must match!,Password must contain 1 or more lowercase characters.',
                    path: '/api/v1/auth/login'
                }
            }
        }
    ]);

    test('it should show the appropriate form input error messages', async () => {
        const errorMessages = [
            'Passwords must match!',
            'Password must contain 1 or more lowercase characters.'
        ];

        await renderComponentWithProvider(true);

        const resetPasswordTab = screen.getByRole('tab', {
            name: /reset password/i
        })

        await user.click(resetPasswordTab);

        const passwordInput = screen.getByLabelText('Password');

        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(passwordInput);
        await user.keyboard('TESTING');

        await user.click(confirmPasswordInput);
        await user.keyboard('PASSWORD');

        await user.click(submitButton);

        for (const errorMessage of errorMessages) {
            const resetPasswordErrorMessage = screen.getByText(errorMessage);

            expect(resetPasswordErrorMessage).toBeInTheDocument();
            expect(resetPasswordErrorMessage).toHaveClass('MuiAlert-message');
        }
    });
});

describe('User submits a valid reset password', () => {
    createServer([
        {
            method: 'get',
            path: 'http://localhost:8080/api/v1/customers/email/:email',
            statusCode: 200,
            res: () => {
                return {
                    id: 1,
                    firstName: 'Test',
                    lastName: 'Users',
                    email: 'testusers@mail.com',
                    age: 32,
                    gender: 'MALE',
                    profileImage: '',
                    roles: ['ROLE_USER'],
                    username: 'testusers@mail.com'
                }
            }
        },
        {
            method: 'patch',
            path: 'http://localhost:8080/api/v1/customers/:customerId/reset-password',
            statusCode: 200,
            res: () => {
                return {}
            }
        }
    ]);

    test('it should show display a toast message and change back to the default tab', async () => {
        const {history} = await renderComponentWithProvider(false);

        const resetPasswordTab = screen.getByRole('tab', {
            name: /reset password/i
        })

        await user.click(resetPasswordTab);

        // Fill out the form
        const passwordInput = screen.getByLabelText('Password');

        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        });

        await user.click(passwordInput);
        await user.keyboard('password');

        await user.click(confirmPasswordInput);
        await user.keyboard('password');

        // Verify submit button is not disabled
        await user.click(submitButton);

        const userImage = screen.getByRole('img', {
            name: /profile-image/i
        });

        // Display toast message
        // Navigate to back to profile page
        // Reset tab back to default tab
        expect(mockEnqueue).toHaveBeenCalledWith('Password was reset successfully', {'variant': 'success'})
        expect(history.location.pathname).toBe('/profile');
        expect(userImage).toBeInTheDocument();
    });
});