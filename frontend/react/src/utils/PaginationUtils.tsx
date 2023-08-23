import {GetCustomerPageData} from "../types.ts";
import {AppDispatch} from "../store/Store.tsx";
import {getCustomersPage} from "../store/customer/CustomerActions.tsx";

export const handleCustomerPagination = (dispatch: AppDispatch, query: string | undefined, page: number, size: number, sort: string) => {
    if (query) {
        void dispatch(getCustomersPage(buildGetCustomerPageObject(
            query, page, size, sort
        )));
    } else {
        void dispatch(getCustomersPage(buildGetCustomerPageObject(
            "", page, size, sort
        )));
    }
}

const buildGetCustomerPageObject = (query: string, page: number, size: number, sort: string): GetCustomerPageData => {
    return {
        query,
        page,
        size,
        sort
    };
};