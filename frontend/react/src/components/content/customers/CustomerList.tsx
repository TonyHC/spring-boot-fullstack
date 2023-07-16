import CustomerItem from "./CustomerItem..tsx";
import {Customer} from "../../../store/slices/CustomerSlice.tsx";
import {Stack} from "@mui/material";

interface CustomerListProps {
    customers: Customer[];
    onDeleteCustomer: (customerId: string) => Promise<void>;
}

const CustomerList = ({customers, onDeleteCustomer}: CustomerListProps) => {
    return (
        <>
            <Stack
                direction="row"
                useFlexGap flexWrap="wrap"
                alignItems="center"
                justifyContent="space-around"
            >
                {
                    customers.map(customer => (
                        <CustomerItem key={customer.id} customer={customer} onDeleteCustomer={onDeleteCustomer}/>
                    ))
                }
            </Stack>
        </>
    );
};

export default CustomerList;