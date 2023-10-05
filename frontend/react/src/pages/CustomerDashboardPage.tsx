import CustomerDashboard from "../components/customer/CustomerDashboard.tsx";
import {deleteCustomerById, findLatestCustomers, getCustomersPage} from "../store/customer/CustomerActions.ts";
import {useSelector} from "react-redux";
import {RootState} from "../store/Store.tsx";
import React, {useEffect} from "react";
import {SelectChangeEvent} from "@mui/material";
import {Params, useParams} from "react-router-dom";
import {handleCustomerPagination} from "../utils/PaginationUtils.ts";
import {useSnackbar} from "notistack";
import {useThunk} from "../hooks/useThunk.ts";

const CustomerDashboardPage = () => {
    const {customerPage} = useSelector((state: RootState) => state.customer);
    const {enqueueSnackbar} = useSnackbar();
    const params: Readonly<Params> = useParams();
    const {query} = params;

    const {runThunk: runFindLatestCustomers, isLoading: isFindingLatestCustomers} = useThunk(findLatestCustomers);
    const {runThunk: runGetCustomerPage, isLoading: isGettingCustomersPage} = useThunk(getCustomersPage);
    const {runThunk: runDeleteCustomerById, isLoading: isDeletingCustomer} = useThunk(deleteCustomerById);

    const loadingStatus = isFindingLatestCustomers || isGettingCustomersPage || isDeletingCustomer;

    useEffect(() => {
        handleCustomerPagination(runGetCustomerPage, query, customerPage.currentPage, customerPage.pageSize, customerPage.sort);
        runFindLatestCustomers(1000);
        window.scroll({top: 0, left: 0});
    }, [customerPage.currentPage, customerPage.pageSize, customerPage.sort, query, runFindLatestCustomers, runGetCustomerPage]);

    const handleChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
        handleCustomerPagination(runGetCustomerPage, query, value - 1, customerPage.pageSize, customerPage.sort);
        window.scroll({top: 0, left: 0});
    };

    const handlePageSize = (event: SelectChangeEvent<number>): void => {
        handleCustomerPagination(runGetCustomerPage, query, 0, +event.target.value, customerPage.sort);
        window.scroll({top: 0, left: 0});
    };

    const deleteCustomerHandler = (customerId: string): void => {
        window.scroll({top: 0, left: 0});
        runDeleteCustomerById({customerId, enqueueSnackbar});
        handleCustomerPagination(runGetCustomerPage, query, customerPage.currentPage, customerPage.pageSize, customerPage.sort);
        runFindLatestCustomers(1000);
    };

    return (
        <CustomerDashboard status={loadingStatus} customerPage={customerPage} onDeleteCustomer={deleteCustomerHandler}
                           handleChange={handleChange} handlePageSize={handlePageSize}/>
    );
};

export default CustomerDashboardPage;