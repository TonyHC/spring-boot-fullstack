import CustomerForm from "../components/shared/CustomerForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {Location, Navigate, NavigateFunction, Params, useLocation, useNavigate, useParams} from "react-router-dom";
import {
    createCustomer,
    getCustomerById,
    updateCustomerById,
    uploadCustomerProfileImage
} from "../store/customer/CustomerActions.ts";
import {useEffect, useState} from "react";
import useCurrentPage, {customerFormRoutes} from "../hooks/useCurrentPage.ts";
import {FormikValues} from "formik";
import {resetCustomerPageState} from "../store/customer/CustomerSlice.ts";
import {useSnackbar} from "notistack";
import {useThunk} from "../hooks/useThunk.ts";
import Delay from "../components/shared/Delay.tsx";

const CustomerFormPage = () => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const {customer, customerPage} = useSelector((state: RootState) => state.customer);
    const {isAuth} = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>();
    const params: Readonly<Params> = useParams();
    const location: Location = useLocation();
    const navigate: NavigateFunction = useNavigate();
    const {customerId} = params;
    const currentPath: string = useCurrentPage(customerFormRoutes);
    const {enqueueSnackbar} = useSnackbar();

    const {
        runThunk: runGetCustomerById,
        isLoading: isGettingCustomer,
        error: gettingCustomerError
    } = useThunk(getCustomerById);
    const {
        runThunk: runCreateCustomer,
        error: createCustomerError
    } = useThunk(createCustomer);
    const {
        runThunk: runUpdateCustomerById,
        error: updateCustomerError
    } = useThunk(updateCustomerById);
    const {
        runThunk: runUploadCustomerProfileImage,
    } = useThunk(uploadCustomerProfileImage);

    const customerFormError = createCustomerError.message || updateCustomerError.message;

    useEffect(() => {
        if (customerId) {
            runGetCustomerById({customerId});
            setEditMode(true);
        }

        window.scroll({top: 0, left: 0});
    }, [customerId, navigate, runGetCustomerById]);

    const createCustomerHandler = (customerFormValues: FormikValues): void => {
        runCreateCustomer({navigate, customer: customerFormValues});

        if (currentPath !== customerFormRoutes[0].path) {
            dispatch(resetCustomerPageState());
        }
    };

    const updateCustomerHandler = (customerFormValues: FormikValues, customerId: string): void => {
        runUpdateCustomerById({
            customer: customerFormValues,
            customerId,
            currentPath,
            navigate,
            query: customerPage.query,
            enqueueSnackbar
        });
    };

    const uploadCustomerProfileImageHandler = (customerId: string, formData: FormData, provider: string): void => {
        runUploadCustomerProfileImage({
            customerId,
            formData,
            provider,
            currentPath,
            navigate,
            enqueueSnackbar
        });
    };

    return (
        <>
            {
                currentPath === customerFormRoutes[0].path || currentPath === customerFormRoutes[1].path ?
                    <CustomerForm customerFormErrorMessage={customerFormError} editMode={editMode} isAuth={isAuth}
                                  path={currentPath} onCreateCustomer={createCustomerHandler}/> :
                    <Delay waitBeforeShow={500}>
                        {
                            gettingCustomerError.message ? <div data-testid="not-found-page">
                                <Navigate data-testid="not-found-page" to="/not-found" state={{from: location}}/>
                            </div> : <CustomerForm loadingStatus={isGettingCustomer}
                                                   customerFormErrorMessage={customerFormError}
                                                   editMode={editMode} isAuth={isAuth} path={currentPath}
                                                   onUpdateCustomer={updateCustomerHandler}
                                                   onUploadCustomerProfileImage={uploadCustomerProfileImageHandler}
                                                   existingCustomer={customer}/>
                        }
                    </Delay>
            }
        </>
    );
}

export default CustomerFormPage;