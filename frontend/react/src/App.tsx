import {CssBaseline} from "@mui/material";
import RouterRoutes from "./routes/Routes.tsx";
import Layout from "./components/shared/Layout.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store/Store.tsx";
import useCurrentPage, {sideMenuRoutes} from "./hooks/CurrentPage.tsx";
import {resetOpenActionsListState} from "./store/auth/AuthSlice.tsx";
import {useEffect} from "react";

const App = () => {
    const {isAuth} = useSelector((state: RootState) => state.auth);
    const currentPath: string = useCurrentPage(sideMenuRoutes);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isAuth && currentPath === "*") {
            // Reset the Security Slice state openActionsList field when leaving any routes rendering a page containing a side menu
            dispatch(resetOpenActionsListState());
        } 
    }, [currentPath, dispatch, isAuth]);

    return (
        <Layout>
            <CssBaseline/>
            <RouterRoutes isAuth={isAuth}/>
        </Layout>
    );
};

export default App;