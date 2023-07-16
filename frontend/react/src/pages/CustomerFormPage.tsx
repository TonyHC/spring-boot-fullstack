import CustomerForm from "../components/content/CustomerForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {createCustomer, getCustomerById, updateCustomerById} from "../store/actions/CustomerActions.tsx";
import {useEffect, useState} from "react";
import NotFoundPage from "./NotFoundPage.tsx";
import useCurrentPage, {routes} from "../hooks/CurrentPage.tsx";

const CustomerFormPage = () => {
    const [editMode, setEditMode] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const params = useParams();
    const {customerId} = params;
    const {customer, status, actionType} = useSelector((state: RootState) => state.customer);

    useEffect(() => {
        if (customerId) {
            void dispatch(getCustomerById(customerId));
            setEditMode(true);
        }
    }, [dispatch, customerId]);

    const createCustomerHandler = async (customer: createCustomer) => {
        await dispatch(createCustomer({navigate, customer}));
    }

    const updateCustomerHandler = async (customer: createCustomer, customerId: string) => {
        await dispatch(updateCustomerById({navigate, customer, customerId}));
    }

    const currentPath = useCurrentPage();

    const renderPage = () => {
        if (currentPath === routes[0].path) {
            return <CustomerForm status={status} editMode={editMode}/>
        } else if (currentPath === routes[1].path) {
            return <CustomerForm status={status} editMode={editMode} onCreateCustomer={createCustomerHandler}/>
        } else if (currentPath === routes[2].path) {
            return <CustomerForm status={status} actionType={actionType} editMode={editMode}
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