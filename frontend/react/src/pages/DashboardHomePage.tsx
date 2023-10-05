import Dashboard from "../components/user/Dashboard.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../store/Store.tsx";
import {useEffect} from "react";
import {findLatestCustomers} from "../store/customer/CustomerActions.ts";
import {useThunk} from "../hooks/useThunk.ts";

const DashboardHomePage = () => {
    const {user, status} = useSelector((state: RootState) => state.auth);
    const {customers} = useSelector((state: RootState) => state.customer);
    const {runThunk: runFindLatestCustomers, isLoading} = useThunk(findLatestCustomers);

    useEffect(() => {
        runFindLatestCustomers(1000);
    }, [runFindLatestCustomers]);

    return (
        <Dashboard user={user} authStatus={status} latestCustomers={customers}
                   isLoadingCustomerData={isLoading}/>
    );
};

export default DashboardHomePage;