import Dashboard from "../components/dashboard/Dashboard.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {useEffect} from "react";
import {findLatestCustomers} from "../store/customer/CustomerActions.tsx";

const DashboardHomePage = () => {
    const {user, status: authStatus} = useSelector((state: RootState) => state.auth);
    const {customers, status: customerStatus} = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        void dispatch(findLatestCustomers(1000));
    }, [dispatch]);

    return (
        <Dashboard user={user} authStatus={authStatus} latestCustomers={customers}
                   customerStatus={customerStatus}/>
    );
};

export default DashboardHomePage;