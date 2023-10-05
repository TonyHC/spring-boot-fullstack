import UserProfile from "../components/user/UserProfile.tsx";
import {RootState} from "../store/Store.tsx";
import {useSelector} from "react-redux";
import {uploadCustomerProfileImage} from "../store/customer/CustomerActions.ts";
import {retrieveUser} from "../store/auth/AuthActions.ts";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useSnackbar} from "notistack";
import {useThunk} from "../hooks/useThunk.ts";

const UserProfilePage = () => {
    const {user} = useSelector((state: RootState) => state.auth);
    const navigate: NavigateFunction = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const {runThunk: runRetrieveUser, isLoading} = useThunk(retrieveUser);
    const {runThunk: runUploadCustomerProfileImage} = useThunk(uploadCustomerProfileImage);

    useEffect(() => {
        runRetrieveUser(user.username);
    }, [runRetrieveUser, user.username]);

    const uploadCustomerProfileImageHandler = (customerId: string, formData: FormData, provider: string): void => {
        runUploadCustomerProfileImage({customerId, formData, provider, navigate, enqueueSnackbar});
        runRetrieveUser(user.username)
    };

    return (
        <UserProfile user={user} status={isLoading} onUploadCustomerProfileImage={uploadCustomerProfileImageHandler}/>
    )
};

export default UserProfilePage;