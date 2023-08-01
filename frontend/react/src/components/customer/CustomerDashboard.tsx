import {Alert, Box, Breadcrumbs, Button, Skeleton, Stack, Toolbar, Typography} from "@mui/material";
import NavBar from "../navigation/Navbar.tsx";
import SideMenu from "../navigation/SideMenu.tsx";
import CustomerList from "./CustomerList.tsx";
import {Customer} from "../../store/customer/CustomerSlice.tsx";
import {Link, NavigateFunction, useNavigate} from "react-router-dom";
import {ServerError} from "../../store/customer/CustomerActions.tsx";
import Footer from "../shared/Footer.tsx";
import {JSX} from "react";
import {NavigateNext as NavigateNextIcon} from "@mui/icons-material";

const breadcrumbs: JSX.Element[] = [
    <Link to="/dashboard" key="1">Dashboard</Link>,
    <Typography key="2">
        Customers
    </Typography>
];

interface CustomerDashboardProps {
    customers: Customer[];
    status: string;
    error: ServerError | undefined;
    onDeleteCustomer: (customerId: string) => Promise<void>;
}

const CustomerDashboard = ({customers, status, onDeleteCustomer}: CustomerDashboardProps) => {
    const navigate: NavigateFunction = useNavigate();

    const createClickHandler = (): void => {
        navigate("/customer-form");
    };

    return (
        <>
            <NavBar/>
            <SideMenu/>
            <Stack direction="column" flexGrow={1}>
                {
                    <Box component="main" sx={{flexGrow: 1, p: 3}}>
                        <Toolbar/>
                        {
                            customers.length >= 1 ?
                                <>
                                    <Breadcrumbs
                                        separator={<NavigateNextIcon fontSize="small"/>}
                                        aria-label="breadcrumb"
                                    >
                                        {status === "loading" ? <Skeleton width={150}/> : breadcrumbs}
                                    </Breadcrumbs>
                                    <Toolbar
                                        disableGutters
                                        sx={{
                                            border: "1px solid white",
                                            backgroundColor: "inherit",
                                            my: 2,
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
                                                {status === "loading" ?
                                                    <Skeleton
                                                        width={275}/> : `Result: ${customers.length} customers were found`}
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
                                            {status === "loading" ? <Skeleton width={50}/> : 'Create'}
                                        </Button>
                                    </Toolbar>
                                    <CustomerList customers={customers} status={status}
                                                  onDeleteCustomer={onDeleteCustomer}/>
                                </> :
                                <Alert variant="outlined" severity="error" color="error"
                                       sx={{width: "100%", mt: -1, mb: 2}}>
                                    No customers available
                                </Alert>
                        }
                    </Box>
                }
                <Footer/>
            </Stack>
        </>
    );
};

export default CustomerDashboard;