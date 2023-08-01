import {matchRoutes, useLocation} from "react-router-dom";

interface RoutePath {
    path: string
}

export const customerFormRoutes: RoutePath[] = [
    {path: "/sign-up"},
    {path: "/customer-form"},
    {path: "/customer-form/:customerId"}
];
export const sideMenuRoutes: RoutePath[] = [
    {path: "/dashboard"},
    {path: "/customer-dashboard"}
];

const useCurrentPage = (routes: RoutePath[]): string => {
    const location = useLocation();
    const result = matchRoutes(routes, location)?.find(m => m.pathname === location.pathname);

    let currentPath = "*";

    if (result) {
        currentPath = result.route.path;
    }

    return currentPath
}

export default useCurrentPage;