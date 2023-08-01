import {Route, Routes} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import CustomerFormPage from "../pages/CustomerFormPage.tsx";
import CustomerDashboardPage from "../pages/CustomerDashboardPage.tsx";
import {RequireAuth} from "./RequireAuth.tsx";
import DashboardHomePage from "../pages/DashboardHomePage.tsx";

interface RouterRoutesProps {
    isAuth: boolean;
}

const RouterRoutes = ({isAuth}: RouterRoutesProps) => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={isAuth ? <DashboardHomePage/> : <LoginPage/>}/>
            <Route path="/sign-up" element={isAuth ? <DashboardHomePage/> : <CustomerFormPage/>}/>

            <Route element={<RequireAuth/>}>
                <Route path="/dashboard" element={<DashboardHomePage/>}/>
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