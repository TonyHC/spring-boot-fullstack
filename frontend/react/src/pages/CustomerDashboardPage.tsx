import CustomerDashboard from "../components/customer/CustomerDashboard.tsx";
import {deleteCustomerById, getCustomersPage} from "../store/customer/CustomerActions.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/Store.tsx";
import React, {useEffect} from "react";
import {SelectChangeEvent} from "@mui/material";

const CustomerDashboardPage = () => {
    const {customerPage, status} = useSelector((state: RootState) => state.customer);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        void dispatch(getCustomersPage({
            page: customerPage.currentPage,
            size: customerPage.pageSize,
            sort: customerPage.sort
        }));
        window.scroll({top: 0, left: 0});
    }, [customerPage.currentPage, customerPage.pageSize, customerPage.sort, dispatch]);

    const handleChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
        void dispatch(getCustomersPage({page: value - 1, size: customerPage.pageSize, sort: customerPage.sort}));
        window.scroll({top: 0, left: 0});
    };

    const handlePageSize = (event: SelectChangeEvent<unknown>): void => {
        const value: number | undefined = typeof event.target.value === "number" ? event.target.value : undefined;

        if (value) {
            void dispatch(getCustomersPage({page: 0, size: value, sort: customerPage.sort}));
            window.scroll({top: 0, left: 0});
        }
    }

    const deleteCustomerHandler = async (customerId: string): Promise<void> => {
        window.scroll({top: 0, left: 0});
        await dispatch(deleteCustomerById(customerId));
        await dispatch(getCustomersPage({
            page: customerPage.currentPage,
            size: customerPage.pageSize,
            sort: customerPage.sort
        }));
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