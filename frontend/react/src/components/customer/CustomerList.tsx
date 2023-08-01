import CustomerItem from "./CustomerItem..tsx";
import {Customer} from "../../store/customer/CustomerSlice.tsx";
import {Stack} from "@mui/material";

interface CustomerListProps {
    customers: Customer[];
    status: string;
    onDeleteCustomer: (customerId: string) => Promise<void>;
}

const CustomerList = ({customers, status, onDeleteCustomer}: CustomerListProps) => {
    return (
        <>
            <Stack
                direction="row"
                useFlexGap flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
            >
                {
                    customers.map(customer => (
                        <CustomerItem key={customer.id} customer={customer} status={status}
                                      onDeleteCustomer={onDeleteCustomer}/>
                    ))
                }
            </Stack>
        </>
    );
};

export default CustomerList;