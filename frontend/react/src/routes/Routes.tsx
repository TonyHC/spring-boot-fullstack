import {Route, Routes} from "react-router-dom";
import RequireAuth from "./RequireAuth.tsx";
import React, {Suspense} from "react";
import {CircularProgress} from "@mui/material";

const LoginPage = React.lazy(() => import("../pages/LoginPage.tsx"));
const DashboardHomePage = React.lazy(() => import("../pages/DashboardHomePage.tsx"));
const LandingPage = React.lazy(() => import("../pages/LandingPage.tsx"));
const CustomerDashboardPage = React.lazy(() => import("../pages/CustomerDashboardPage.tsx"));
const CustomerFormPage = React.lazy(() => import("../pages/CustomerFormPage.tsx"));
const NotFoundPage = React.lazy(() => import("../pages/NotFoundPage.tsx"));
const UserProfilePage = React.lazy(() => import("../pages/UserProfilePage.tsx"));

interface RouterRoutesProps {
    isAuth: boolean;
}

const RouterRoutes = ({isAuth}: RouterRoutesProps) => {
    return (
        <Suspense fallback={<CircularProgress sx={{m: 'auto'}}/>}>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={isAuth ? <DashboardHomePage/> : <LoginPage/>}/>
                <Route path="/sign-up" element={isAuth ? <DashboardHomePage/> : <CustomerFormPage/>}/>

                <Route element={<RequireAuth/>}>
                    <Route path="/dashboard" element={<DashboardHomePage/>}/>
                    <Route path="/profile" element={<UserProfilePage/>}/>
                    <Route path="/profile/:customerId" element={<CustomerFormPage/>}/>
                    <Route path="/customer-dashboard" element={<CustomerDashboardPage/>}>
                        <Route path=":query" element={<CustomerDashboardPage/>}/>
                    </Route>
                    <Route path="/customer-form" element={<CustomerFormPage/>}>
                        <Route path=":customerId" element={<CustomerFormPage/>}/>
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </Suspense>
    );
};

export default RouterRoutes;