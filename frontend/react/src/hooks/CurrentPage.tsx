import {matchRoutes, useLocation} from "react-router-dom";

export const routes = [{path: "/sign-up"}, {path: "/customer-form"}, {path: "/customer-form/:customerId"}];

const useCurrentPage = () => {
    const location = useLocation();
    const {route: {path}} = matchRoutes(routes, location)?.find(m => m.pathname === location.pathname)!;
    return path;
}

export default useCurrentPage;