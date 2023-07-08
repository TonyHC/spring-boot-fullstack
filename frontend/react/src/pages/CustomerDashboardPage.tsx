import CustomerDashboard from "../components/content/customers/CustomerDashboard.tsx";
import {useEffect} from "react";
import {getAllCustomers} from "../store/actions/customer-actions.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store";

const CustomerDashboardPage = () => {
    const { customers, status, errors } = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllCustomers());
    }, [dispatch]);

    console.log(customers);

    return (
        <CustomerDashboard customers={customers} status={status} errors={errors} />
    );
};

export default CustomerDashboardPage;