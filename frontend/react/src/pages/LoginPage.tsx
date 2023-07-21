import Login from "../components/login/Login.tsx";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {loginRequest, performLogin} from "../store/auth/AuthActions.tsx";

const LoginPage = () => {
    const {error} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const loginHandler = async (user: loginRequest) => {
        await dispatch(performLogin({navigate, user}));
    }

    return (
        <Login onLogin={loginHandler} error={error}/>
    );
};

export default LoginPage;