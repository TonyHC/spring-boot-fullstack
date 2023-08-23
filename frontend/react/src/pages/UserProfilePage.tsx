import UserProfile from "../components/user/UserProfile.tsx";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {useDispatch, useSelector} from "react-redux";
import {uploadCustomerProfileImage} from "../store/customer/CustomerActions.tsx";
import {retrieveUser} from "../store/auth/AuthActions.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {resetErrorState} from "../store/customer/CustomerSlice.tsx";
import {useSnackbar} from "notistack";

const UserProfilePage = () => {
    const {user, status} = useSelector((state: RootState) => state.auth);
    const {error} = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();
    const navigate: NavigateFunction = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        void dispatch(retrieveUser(user.username));
    }, [dispatch, user.username]);

    const uploadCustomerProfileImageHandler = async (customerId: string, formData: FormData, provider: string): Promise<void> => {
        await dispatch(uploadCustomerProfileImage({customerId, formData, provider, navigate, enqueueSnackbar}));
        await dispatch(retrieveUser(user.username));
    }

    const resetPasswordErrorHandler = (): void => {
        dispatch(resetErrorState());
    }

    return (
        <UserProfile user={user} status={status} error={error}
                     onUploadCustomerProfileImage={uploadCustomerProfileImageHandler}
                     resetPasswordError={resetPasswordErrorHandler}/>
    )
};

export default UserProfilePage;