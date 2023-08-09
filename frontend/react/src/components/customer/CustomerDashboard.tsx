import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    Skeleton,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import NavBar from "../navigation/Navbar.tsx";
import SideMenu from "../navigation/SideMenu.tsx";
import CustomerList from "./CustomerList.tsx";
import {CustomerPage} from "../../store/customer/CustomerSlice.tsx";
import {Link, NavigateFunction, useNavigate} from "react-router-dom";
import Footer from "../shared/Footer.tsx";
import React, {JSX} from "react";
import {NavigateNext as NavigateNextIcon} from "@mui/icons-material";
import {ThemeProvider} from "@mui/material/styles";
import {customerDashboardTheme} from "../../themes/CustomThemes.tsx";

const breadcrumbs: JSX.Element[] = [
    <Link to="/dashboard" key="1">Dashboard</Link>,
    <Typography key="2">
        Customers
    </Typography>
];

interface CustomerDashboardProps {
    customerPage: CustomerPage;
    status: string;
    onDeleteCustomer: (customerId: string) => Promise<void>;
    handleChange: (event: React.ChangeEvent<unknown>, value: number) => void;
    handlePageSize: (event: SelectChangeEvent<unknown>) => void;
}

const CustomerDashboard = ({
                               customerPage, status, onDeleteCustomer, handleChange, handlePageSize
                           }: CustomerDashboardProps) => {
    const {customers, totalItems: count, currentPage: page, totalPages, pageSize} = customerPage;
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
                                                        width={275}/> : `Result: ${count} customers were found`}
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
                                    {
                                        status === "loading" ? <Skeleton width={350} sx={{ml: 'auto', mt: 2}}/> :
                                            <Stack direction="row" display="flex" justifyContent="end"
                                                   alignItems="baseline" mt={2}>
                                                <ThemeProvider theme={customerDashboardTheme}>
                                                    <FormControl size="small">
                                                        <InputLabel id="demo-simple-select-label">Size</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={pageSize}
                                                            label="Size"
                                                            onChange={handlePageSize}
                                                        >
                                                            <MenuItem value={10}>10</MenuItem>
                                                            <MenuItem value={25}>25</MenuItem>
                                                            <MenuItem value={50}>50</MenuItem>
                                                            <MenuItem value={100}>100</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <Pagination count={totalPages} page={page + 1}
                                                                onChange={handleChange}
                                                                color="primary"/>
                                                </ThemeProvider>
                                            </Stack>
                                    }
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