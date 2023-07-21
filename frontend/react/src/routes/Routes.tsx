import {Route, Routes} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import CustomerFormPage from "../pages/CustomerFormPage.tsx";
import CustomerDashboardPage from "../pages/CustomerDashboardPage.tsx";
import {RequireAuth} from "./RequireAuth.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../store/Store.tsx";

const RouterRoutes = () => {
    const {isAuth} = useSelector((state: RootState) => state.auth);

    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={isAuth ? <CustomerDashboardPage /> : <LoginPage/>}/>
            <Route path="/sign-up" element={isAuth ? <CustomerDashboardPage /> : <CustomerFormPage/>}/>

            <Route element={<RequireAuth/>}>
                <Route path="/customer-dashboard" element={<CustomerDashboardPage/>}/>
                <Route path="/customer-form" element={<CustomerFormPage/>}>
                    <Route path=":customerId" element={<CustomerFormPage/>}/>
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    );
};

export default RouterRoutes;