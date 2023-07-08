import CustomerItem from "./CustomerItem..tsx";
import {Customer} from "../../../store/slices/customer-slice.tsx";
import {Stack} from "@mui/material";

interface CustomerListProps {
    customers: Customer[];
}

const CustomerList = ({customers}: CustomerListProps) => {
    return (
        <>
            <Stack
                direction="row"
                useFlexGap flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
            >
                {
                    customers.map(customer => (
                        <CustomerItem key={customer.id} customer={customer}/>
                    ))
                }
            </Stack>
        </>
    );
};

export default CustomerList;