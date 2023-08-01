import CustomerDashboard from "../components/customer/CustomerDashboard.tsx";
import {deleteCustomerById, getAllCustomers} from "../store/customer/CustomerActions.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {useEffect} from "react";

const CustomerDashboardPage = () => {
    const {customers, status, error} = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        void dispatch(getAllCustomers());
    }, [dispatch]);

    const deleteCustomerHandler = async (customerId: string): Promise<void> => {
        await dispatch(deleteCustomerById(customerId));
    }

    return (
        <CustomerDashboard customers={customers} status={status} error={error}
                           onDeleteCustomer={deleteCustomerHandler}/>
    );
};

export default CustomerDashboardPage;