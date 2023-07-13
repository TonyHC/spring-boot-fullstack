import {Alert, Box, Button, CircularProgress, Stack, Toolbar, Typography} from "@mui/material";
import NavBar from "../../navigation/Navbar.tsx";
import SideMenu from "../../navigation/SideMenu.tsx";
import CustomerList from "./CustomerList.tsx";
import {Customer} from "../../../store/slices/CustomerSlice.tsx";
import {useNavigate} from "react-router-dom";

interface CustomerDashboardProps {
    customers: Customer[];
    status: string;
    errors: unknown;
    onDeleteCustomer: (customerId: string | undefined) => void;
}

const CustomerDashboard = ({customers, status, onDeleteCustomer}: CustomerDashboardProps) => {
    const navigate = useNavigate();

    const createClickHandler = () => {
        navigate("/customer-form");
    };

    return (
        <>
            <NavBar/>
            <SideMenu/>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar/>
                {status == "loading" && <CircularProgress sx={{display: "flex", m: "auto"}}/>}
                {
                    customers.length >= 1 ?
                        <>
                            <Toolbar
                                disableGutters
                                sx={{
                                    border: "1px solid white",
                                    backgroundColor: "inherit",
                                    mb: 2,
                                    "@media (min-width: 600px)": {
                                        minHeight: "auto"
                                    }
                                }}>
                                <Stack direction="row" flexGrow={1}>
                                    <Typography
                                        variant="body1"
                                        display="block"
                                        sx={{
                                            fontFamily: "monospace",
                                            fontWeight: 700,
                                            color: "inherit",
                                            textDecoration: "none",
                                            ml: 3
                                        }}
                                    >
                                        Result: {customers.length} customers were found
                                    </Typography>
                                </Stack>
                                <Button
                                    color="inherit"
                                    variant="text"
                                    sx={{
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        mr: 2
                                    }}
                                    onClick={createClickHandler}
                                >
                                    Create
                                </Button>
                            </Toolbar>
                            <CustomerList customers={customers} onDeleteCustomer={onDeleteCustomer}/>
                        </> :
                        <Alert variant="outlined" severity="error" color="error"
                               sx={{width: "100%", mt: -1, mb: 2}}>
                            No customers available
                        </Alert>
                }
            </Box>
        </>
    );
};

export default CustomerDashboard;