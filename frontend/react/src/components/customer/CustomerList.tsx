import CustomerItem from "./CustomerItem..tsx";
import {Stack} from "@mui/material";
import {Customer} from "../../types";

interface CustomerListProps {
    customers: Customer[];
    status: boolean;
    onDeleteCustomer: (customerId: string) => void;
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