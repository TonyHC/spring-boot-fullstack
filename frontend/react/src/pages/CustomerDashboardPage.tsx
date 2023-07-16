import CustomerDashboard from "../components/content/customers/CustomerDashboard.tsx";
import {useEffect} from "react";
import {deleteCustomerById, getAllCustomers} from "../store/actions/CustomerActions.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";

const CustomerDashboardPage = () => {
    const {customers, status, errors} = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        void dispatch(getAllCustomers());
    }, [dispatch]);

    const deleteCustomerHandler = async (customerId: string) => {
        await dispatch(deleteCustomerById(customerId));
    }

    return (
        <CustomerDashboard customers={customers} status={status} errors={errors}
                           onDeleteCustomer={deleteCustomerHandler}/>
    );
};

export default CustomerDashboardPage;