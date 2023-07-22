import CustomerForm from "../components/shared/CustomerForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {createCustomer, getCustomerById, updateCustomerById} from "../store/customer/CustomerActions.tsx";
import {useEffect, useState} from "react";
import NotFoundPage from "./NotFoundPage.tsx";
import useCurrentPage, {routes} from "../hooks/CurrentPage.tsx";
import {FormikValues} from "formik";
import {resetErrorState} from "../store/customer/CustomerSlice.tsx";

const CustomerFormPage = () => {
    const [editMode, setEditMode] = useState(false);
    const {customer, status, actionType, error} = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();

    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const {customerId} = params;

    useEffect(() => {
        if (customerId) {
            void dispatch(getCustomerById(customerId));
            setEditMode(true);
        }
    }, [dispatch, customerId]);

    useEffect(() => {
        // Reset the Customer Slice state error field when leaving this page
        dispatch(resetErrorState());
    }, [dispatch, location.pathname]);

    const createCustomerHandler = async (customer: FormikValues) => {
        await dispatch(createCustomer({navigate, customer}));
    }

    const updateCustomerHandler = async (customer: FormikValues, customerId: string) => {
        await dispatch(updateCustomerById({navigate, customer, customerId}));
    }

    const currentPath = useCurrentPage();

    const renderPage = () => {
        if (currentPath === routes[0].path || currentPath === routes[1].path) {
            return <CustomerForm status={status} error={error} editMode={editMode}
                                 onCreateCustomer={createCustomerHandler}/>
        } else if (currentPath === routes[2].path) {
            return <CustomerForm status={status} error={error} actionType={actionType} editMode={editMode}
                                 onUpdateCustomer={updateCustomerHandler}
                                 existingCustomer={customer}/>
        } else {
            return <NotFoundPage/>
        }
    }

    return (
        renderPage()
    );
}

export default CustomerFormPage;