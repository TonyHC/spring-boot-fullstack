import Login from "../components/login/Login.tsx";
import {Location, NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {performLogin} from "../store/auth/AuthActions.tsx";
import {resetErrorState} from "../store/auth/AuthSlice.tsx";
import {useEffect} from "react";
import {LoginRequest} from "../types.ts";

const LoginPage = () => {
    const {error} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate: NavigateFunction = useNavigate();
    const location: Location = useLocation();

    useEffect(() => {
        // Reset the Security Slice state error field when leaving this page
        dispatch(resetErrorState());
    }, [dispatch, location.pathname]);

    const loginHandler = async (user: LoginRequest): Promise<void> => {
        await dispatch(performLogin({navigate, user}));
    };

    return (
        <Login onLogin={loginHandler} error={error} />
    );
};

export default LoginPage;