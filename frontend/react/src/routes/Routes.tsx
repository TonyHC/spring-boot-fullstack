import {Route, Routes} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import CustomerFormPage from "../pages/CustomerFormPage.tsx";
import CustomerDashboardPage from "../pages/CustomerDashboardPage.tsx";

const RouterRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/sign-up" element={<CustomerFormPage/>}/>
            <Route path="/customer-dashboard" element={<CustomerDashboardPage/>}/>
            <Route path="/customer-form" element={<CustomerFormPage/>}>
                <Route path=":customerId" element={<CustomerFormPage/>}/>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    );
};

export default RouterRoutes;