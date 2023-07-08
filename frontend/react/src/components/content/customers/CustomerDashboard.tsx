import {Box, CircularProgress, Toolbar, Typography} from "@mui/material";
import NavBar from "../../navigation/Navbar.tsx";
import SideMenu from "../../navigation/SideMenu.tsx";
import CustomerList from "./CustomerList.tsx";
import {Customer} from "../../../store/slices/customer-slice.tsx";

interface CustomerDashboardProps {
    customers: Customer[];
    status: string;
    errors: unknown;
}

const CustomerDashboard = ({customers, status}: CustomerDashboardProps) => {
    return (
        <>
            <NavBar/>
            <SideMenu/>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar/>
                {status == "loading" && <CircularProgress/>}
                {customers.length >= 1 ? <CustomerList customers={customers}/> :
                    <Typography>No customers available</Typography>}
            </Box>
        </>
    );
};

export default CustomerDashboard;