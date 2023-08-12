import CustomerForm from "../components/shared/CustomerForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {Location, NavigateFunction, useLocation, useNavigate, useParams} from "react-router-dom";
import {
    createCustomer,
    getCustomerById,
    updateCustomerById,
    uploadCustomerProfileImage
} from "../store/customer/CustomerActions.tsx";
import {JSX, useEffect, useState} from "react";
import NotFoundPage from "./NotFoundPage.tsx";
import useCurrentPage, {customerFormRoutes} from "../hooks/CurrentPage.tsx";
import {FormikValues} from "formik";
import {resetErrorState, updateCustomerPageState} from "../store/customer/CustomerSlice.tsx";

const CustomerFormPage = () => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const {customer, status, actionType, error} = useSelector((state: RootState) => state.customer);
    const {isAuth} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const params = useParams();
    const location: Location = useLocation();
    const navigate: NavigateFunction = useNavigate();
    const {customerId} = params;
    const currentPath: string = useCurrentPage(customerFormRoutes);

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

    const createCustomerHandler = async (customerFormValues: FormikValues): Promise<void> => {
        await dispatch(createCustomer({navigate, customer: customerFormValues}));
        dispatch(updateCustomerPageState());
    }

    const updateCustomerHandler = async (customerFormValues: FormikValues, customerId: string): Promise<void> => {
        await dispatch(updateCustomerById({customer: customerFormValues, customerId, currentPath, navigate}));
    }

    const uploadCustomerProfileImageHandler = async (customerId: string, formData: FormData, provider: string): Promise<void> => {
        await dispatch(uploadCustomerProfileImage({customerId, formData, provider, currentPath, navigate}));
    }

    const renderPage = (): JSX.Element => {
        if (currentPath === customerFormRoutes[0].path || currentPath === customerFormRoutes[1].path) {
            return <CustomerForm status={status} error={error} editMode={editMode} isAuth={isAuth} path={currentPath}
                                 onCreateCustomer={createCustomerHandler}/>
        } else if (currentPath === customerFormRoutes[2].path || currentPath === customerFormRoutes[3].path) {
            return <CustomerForm status={status} error={error} actionType={actionType} editMode={editMode}
                                 isAuth={isAuth} path={currentPath} onUpdateCustomer={updateCustomerHandler}
                                 onUploadCustomerProfileImage={uploadCustomerProfileImageHandler}
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