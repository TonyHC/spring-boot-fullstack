import CustomerDashboard from "../components/customer/CustomerDashboard.tsx";
import {deleteCustomerById, findLatestCustomers} from "../store/customer/CustomerActions.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import React, {useEffect} from "react";
import {SelectChangeEvent} from "@mui/material";
import {Params, useParams} from "react-router-dom";
import {handleCustomerPagination} from "../utils/PaginationUtils.tsx";
import {useSnackbar} from "notistack";

const CustomerDashboardPage = () => {
    const {customerPage, status} = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();
    const {enqueueSnackbar} = useSnackbar();
    const params: Readonly<Params> = useParams();
    const {query} = params;

    useEffect(() => {
        handleCustomerPagination(dispatch, query, customerPage.currentPage, customerPage.pageSize, customerPage.sort);
        void dispatch(findLatestCustomers(1000));
        window.scroll({top: 0, left: 0});
    }, [customerPage.currentPage, customerPage.pageSize, customerPage.sort, dispatch, query]);

    const handleChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
        handleCustomerPagination(dispatch, query, value - 1, customerPage.pageSize, customerPage.sort);
        window.scroll({top: 0, left: 0});
    };

    const handlePageSize = (event: SelectChangeEvent<unknown>): void => {
        const value: number | undefined = typeof event.target.value === "number" ? event.target.value : undefined;

        if (value) {
            handleCustomerPagination(dispatch, query, 0, value, customerPage.sort);
            window.scroll({top: 0, left: 0});
        }
    }

    const deleteCustomerHandler = async (customerId: string): Promise<void> => {
        window.scroll({top: 0, left: 0});
        await dispatch(deleteCustomerById({customerId, enqueueSnackbar}));
        handleCustomerPagination(dispatch, query, customerPage.currentPage, customerPage.pageSize, customerPage.sort);
        await dispatch(findLatestCustomers(1000));
    }

    return (
        <CustomerDashboard status={status}
                           customerPage={customerPage}
                           onDeleteCustomer={deleteCustomerHandler}
                           handleChange={handleChange}
                           handlePageSize={handlePageSize}/>
    );
};

export default CustomerDashboardPage;