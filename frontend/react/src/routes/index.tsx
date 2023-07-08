import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import SignUpPage from "../pages/SignUpPage";
import UserHomePage from "../pages/UserHomePage";
import CustomerDashboardPage from "../pages/CustomerDashboardPage.tsx";

// const LandingPage = React.lazy(() => import("../pages/LandingPage"));
// const LoginPage = React.lazy(() => import("../pages/LoginPage"));
// const NotFoundPage = React.lazy(() => import("../pages/NotFoundPage"));

const ReactRouterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={ <LandingPage/> } />
      <Route path="/login" element={ <LoginPage/> } />
      <Route path="/sign-up" element={ <SignUpPage/> } />
      <Route path="/home" element={ <UserHomePage/> } />
      <Route path="/customer-dashboard" element={ <CustomerDashboardPage/> } />
      <Route path="*" element={ <NotFoundPage/> } />
    </Routes>
  );
};

export default ReactRouterRoutes;