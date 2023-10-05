import {GetCustomerPageData} from "../types.ts";

export const handleCustomerPagination = (
    runGetCustomerPage: (arg: GetCustomerPageData) => void,
    query: string | undefined, page: number, size: number, sort: string
) => {
    if (query) {
        runGetCustomerPage({query, page, size, sort});
    } else {
        runGetCustomerPage({query: '', page, size, sort});
    }
};