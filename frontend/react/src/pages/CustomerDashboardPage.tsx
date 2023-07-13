import CustomerDashboard from "../components/content/customers/CustomerDashboard.tsx";
import {useEffect} from "react";
import {deleteCustomerById, getAllCustomers} from "../store/actions/CustomerActions.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {useNavigate} from "react-router-dom";

const CustomerDashboardPage = () => {
    const {customers, status, errors} = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllCustomers());
    }, [dispatch]);

    const deleteCustomerHandler = (customerId: string | undefined) => {
        dispatch(deleteCustomerById({navigate, customerId}));
    }

    return (
        <CustomerDashboard customers={customers} status={status} errors={errors}
                           onDeleteCustomer={deleteCustomerHandler}/>
    );
};

export default CustomerDashboardPage;