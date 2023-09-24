import {describe, test, vi} from "vitest";
import {createServer} from "../test/server.ts";
import {renderWithProviders} from "../test/mockedStoreWrapper.tsx";
import {Router} from "react-router-dom";
import {RequireAuth} from "./RequireAuth.tsx";
import {createMemoryHistory, MemoryHistory} from "history";

const renderComponentWithProvider = (history: MemoryHistory) => {
    renderWithProviders(
        <Router location={history.location} navigator={history}>
            <RequireAuth/>
        </Router>
    );
};

describe('User is not logged in', () => {
    test('it should redirect to the login page when user tries to access a authenticated route ', () => {
        const history: MemoryHistory = createMemoryHistory({initialEntries: ['/dashboard']});

        renderComponentWithProvider(history);

        expect(history.location.pathname).toBe('/login');
    });
});


describe('User is logged in', () => {
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

    test('it should navigate to the correct authenticated route', () => {
        const history: MemoryHistory = createMemoryHistory({initialEntries: ['/dashboard']});

        // Set the token in localStorage
        window.localStorage.setItem('token', JSON.stringify('Some token'));

        // Mock the jwt-decode library to return the decoded token
        vi.mock('jwt-decode', () => ({
            default: vi.fn(() => ({
                "scopes": [
                    "ROLE_USER"
                ],
                "sub": "dummyusers@gmail.com",
                "iss": "localhost",
                "iat": Date.now(),
                "exp": Date.now()
            }))
        }));

        renderComponentWithProvider(history);

        expect(history.location.pathname).toBe('/dashboard');
    });
});
