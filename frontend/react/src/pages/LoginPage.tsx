import Login from "../components/login/Login.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {performLogin} from "../store/auth/AuthActions.ts";
import {LoginRequest} from "../types.ts";
import {useThunk} from "../hooks/useThunk.ts";

const LoginPage = () => {
    const {runThunk: runPerformLogin, error} = useThunk(performLogin);
    const navigate: NavigateFunction = useNavigate();

    const loginHandler = (user: LoginRequest): void => {
        runPerformLogin({navigate, user});
    };

    return (
        <Login onLogin={loginHandler} error={error}/>
    );
};

export default LoginPage;