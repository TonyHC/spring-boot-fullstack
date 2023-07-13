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
    const {customer} = useSelector((state: RootState) => state.customer);

    useEffect(() => {
        if (customerId) {
            dispatch(getCustomerById(customerId));
            setEditMode(true);
        }
    }, []);

    const createCustomerHandler = (customer: createCustomer) => {
        dispatch(createCustomer({navigate, customer}));
    }

    const updateCustomerHandler = (customer: createCustomer, customerId: string | undefined) => {
        dispatch(updateCustomerById({navigate, customer, customerId}));
    }

    const currentPath = useCurrentPage();

    const renderPage = () => {
        if (currentPath === routes[0].path) {
            return <CustomerForm editMode={editMode}/>
        } else if (currentPath === routes[1].path) {
            return <CustomerForm editMode={editMode} onCreateCustomer={createCustomerHandler}/>
        } else if (currentPath === routes[2].path) {
            return <CustomerForm editMode={editMode} onUpdateCustomer={updateCustomerHandler}
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