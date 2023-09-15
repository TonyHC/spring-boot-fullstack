import CustomerForm from "../components/shared/CustomerForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {Location, NavigateFunction, Params, useLocation, useNavigate, useParams} from "react-router-dom";
import {
    createCustomer,
    getCustomerById,
    updateCustomerById,
    uploadCustomerProfileImage
} from "../store/customer/CustomerActions.tsx";
import {useEffect, useState} from "react";
import useCurrentPage, {customerFormRoutes} from "../hooks/CurrentPage.tsx";
import {FormikValues} from "formik";
import {resetErrorState, updateCustomerPageState} from "../store/customer/CustomerSlice.tsx";
import {useSnackbar} from "notistack";

const CustomerFormPage = () => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const {customer, status, actionType, error, customerPage} = useSelector((state: RootState) => state.customer);
    const {isAuth} = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>();
    const params: Readonly<Params> = useParams();
    const location: Location = useLocation();
    const navigate: NavigateFunction = useNavigate();
    const {customerId} = params;
    const currentPath: string = useCurrentPage(customerFormRoutes);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (customerId) {
            void dispatch(getCustomerById({customerId, navigate}));
            setEditMode(true);
        }

        window.scroll({top: 0, left: 0});
    }, [dispatch, customerId, navigate]);

    useEffect(() => {
        // Reset the Customer Slice state error field when leaving this page
        dispatch(resetErrorState());
    }, [dispatch, location.pathname]);

    const createCustomerHandler = async (customerFormValues: FormikValues): Promise<void> => {
        await dispatch(createCustomer({navigate, customer: customerFormValues}));

        if (currentPath !== customerFormRoutes[0].path) {
            dispatch(updateCustomerPageState());
        }
    };

    const updateCustomerHandler = async (customerFormValues: FormikValues, customerId: string): Promise<void> => {
        await dispatch(updateCustomerById({
            customer: customerFormValues,
            customerId,
            currentPath,
            navigate,
            query: customerPage.query,
            enqueueSnackbar
        }));
    };

    const uploadCustomerProfileImageHandler = async (customerId: string, formData: FormData, provider: string): Promise<void> => {
        await dispatch(uploadCustomerProfileImage({
            customerId,
            formData,
            provider,
            currentPath,
            navigate,
            enqueueSnackbar
        }));
    };

    return (
        <>
            {
                currentPath === customerFormRoutes[0].path || currentPath === customerFormRoutes[1].path ?
                    <CustomerForm status={status} error={error} editMode={editMode} isAuth={isAuth}
                                  path={currentPath} onCreateCustomer={createCustomerHandler}/> :
                    <CustomerForm status={status} error={error} actionType={actionType} editMode={editMode}
                                  isAuth={isAuth} path={currentPath} onUpdateCustomer={updateCustomerHandler}
                                  onUploadCustomerProfileImage={uploadCustomerProfileImageHandler}
                                  existingCustomer={customer}/>
            }
        </>
    );
}

export default CustomerFormPage;