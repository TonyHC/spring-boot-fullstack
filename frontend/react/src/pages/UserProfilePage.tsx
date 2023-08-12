import UserProfile from "../components/user/UserProfile.tsx";
import {AppDispatch, RootState} from "../store/Store.tsx";
import {useDispatch, useSelector} from "react-redux";
import {uploadCustomerProfileImage} from "../store/customer/CustomerActions.tsx";
import {retrieveUser} from "../store/auth/AuthActions.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const UserProfilePage = () => {
    const {user, status} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate: NavigateFunction = useNavigate();
    
    useEffect(() => {
        void dispatch(retrieveUser(user.username));
    }, [dispatch, user.username]);
    
    const uploadCustomerProfileImageHandler = async (customerId: string, formData: FormData, provider: string): Promise<void> => {
        await dispatch(uploadCustomerProfileImage({customerId, formData, provider, navigate}));
        await dispatch(retrieveUser(user.username));
    }

    return (
        <UserProfile user={user} status={status} onUploadCustomerProfileImage={uploadCustomerProfileImageHandler}/>
    )
};

export default UserProfilePage;