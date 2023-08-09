import NavBar from "../navigation/Navbar.tsx";
import SideMenu from "../navigation/SideMenu.tsx";
import {
    Breadcrumbs,
    Container,
    Divider,
    Grid,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material";
import {AccessTime as AccessTimeIcon, NavigateNext as NavigateNextIcon} from '@mui/icons-material';
import {User} from "../../store/auth/AuthSlice.tsx"
import {styled, ThemeProvider} from "@mui/material/styles";
import React, {JSX} from "react";
import {Customer} from "../../store/customer/CustomerSlice.tsx";
import {Link} from "react-router-dom";
import Chart from "react-apexcharts";
import {dashboardTheme} from "../../themes/CustomThemes.tsx";
import Footer from "../shared/Footer.tsx";
import {ageGroupCount, getGreeting} from "../../utils/DashboardUtils.tsx";

const breadcrumbs: JSX.Element[] = [
    <Typography key="1">
        Home
    </Typography>
];

const GridPaper = styled(Paper)<{ component?: React.ElementType }>({
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#B2BAC2'
});

interface DashboardProps {
    user: User;
    authStatus: string;
    latestCustomers: Customer[];
    customerStatus: string;
}

const Dashboard = ({user, authStatus, latestCustomers, customerStatus}: DashboardProps) => {
    const male: Customer[] = latestCustomers.filter(customer => customer.gender === "MALE");
    const female: Customer[] = latestCustomers.filter(customer => customer.gender === "FEMALE");
    const greetingMessage: string = getGreeting(new Date().getHours());

    const state = {
        options: {
            chart: {
                id: "basic-bar"
            },
            title: {
                text: "Male / Female"
            },
            subtitle: {
              text: 'Latest 1000 Customers'
            },
            xaxis: {
                categories: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            fill: {
                opacity: 1
            },
        },
        series: [{
            name: 'Male',
            data: [
                ageGroupCount(male, 18, 24), ageGroupCount(male, 24, 34), ageGroupCount(male, 35, 44),
                ageGroupCount(male, 45, 54), ageGroupCount(male, 55, 64), ageGroupCount(male, 65)
            ]
        }, {
            name: 'Female',
            data: [
                ageGroupCount(female, 18, 24), ageGroupCount(female, 24, 34), ageGroupCount(female, 35, 44),
                ageGroupCount(female, 45, 54), ageGroupCount(female, 55, 64), ageGroupCount(female, 65)
            ]
        }]
    };

    return (
        <>
            <NavBar/>
            <SideMenu/>
            <Stack direction="column" flexGrow={1}>
                <Toolbar/>
                <Container maxWidth="xl" sx={{my: 2}}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small"/>}
                        aria-label="breadcrumb"
                    >
                        {authStatus === "loading" ? <Skeleton width={100}/> : breadcrumbs}
                    </Breadcrumbs>
                    <Typography variant="h5" component="h5" my={2}>
                        {authStatus === "loading" ?
                            <Skeleton height={50} width={250}
                                      sx={{mb: -8}}/> : `Good ${greetingMessage}, ${user.firstName}`}
                    </Typography>
                    <Grid container spacing={3}>
                        {/* Display some User information */}
                        <Grid item xs={12} md={8} lg={8} xl={9}>
                            {
                                customerStatus === "loading" ? <Skeleton height={525} sx={{mt: -10}}/> :
                                    <GridPaper>
                                        <Chart
                                            options={state.options}
                                            series={state.series}
                                            type="bar"
                                            height={300}
                                        />
                                    </GridPaper>
                            }
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} xl={3}>

                            {/* Total customers */}
                            {
                                customerStatus === "loading" ? <Skeleton height={200} sx={{mt: -1}}/> :
                                    <GridPaper sx={{minHeight: 150, mb: 5}}>
                                        <Typography component="h2" variant="h6" gutterBottom
                                                    sx={{color: "rgba(0, 0, 0, 0.87)"}}>
                                            Total Customers
                                        </Typography>
                                        <Typography component="p" variant="h4" sx={{color: "rgba(0, 0, 0, 0.87)"}}>
                                            {latestCustomers.length}
                                        </Typography>
                                        <Divider sx={{my: 1}}/>
                                        <Stack direction="row">
                                            <AccessTimeIcon sx={{fill: "black"}}/>
                                            <Typography color="text.secondary" sx={{flex: 1, ml: 1}}>
                                                on {new Date().toJSON().slice(0, 10)}
                                            </Typography>
                                        </Stack>
                                    </GridPaper>
                            }

                            {/* Ratio of customers */}
                            {
                                customerStatus === "loading" ? <Skeleton height={200} sx={{mt: -0.5}}/> :
                                    <GridPaper sx={{minHeight: 150}}>
                                        <Typography component="h2" variant="h6" gutterBottom
                                                    sx={{color: "rgba(0, 0, 0, 0.87)"}}>
                                            Ratio (M/ F)
                                        </Typography>
                                        <Typography component="p" variant="h4" sx={{color: "rgba(0, 0, 0, 0.87)"}}>
                                            {(male.length / female.length).toFixed(2)}
                                        </Typography>
                                        <Divider sx={{my: 1}}/>
                                        <Stack direction="row">
                                            <AccessTimeIcon sx={{fill: "black"}}/>
                                            <Typography color="text.secondary" sx={{flex: 1, ml: 1}}>
                                                on {new Date().toJSON().slice(0, 10)}
                                            </Typography>
                                        </Stack>
                                    </GridPaper>
                            }
                        </Grid>

                        {/* Display customers in Table component */}
                        <Grid item xs={12} xl={12}>
                            {
                                customerStatus === "loading" ?
                                    <Skeleton height={475} sx={{mt: -25, mb: -10}}/> :
                                    <>
                                        <GridPaper>
                                            <Typography component="h2" variant="h6" gutterBottom
                                                        sx={{color: "rgba(0, 0, 0, 0.87)"}}>
                                                Recent Customers
                                            </Typography>
                                            <ThemeProvider theme={dashboardTheme}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>ID</TableCell>
                                                            <TableCell>First Name</TableCell>
                                                            <TableCell>Last Name</TableCell>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell>Age</TableCell>
                                                            <TableCell align="right">Gender</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {latestCustomers.slice(0, 5).map((customer) => (
                                                            <TableRow key={customer.id}>
                                                                <TableCell>{customer.id}</TableCell>
                                                                <TableCell>{customer.firstName}</TableCell>
                                                                <TableCell>{customer.lastName}</TableCell>
                                                                <TableCell>{customer.email}</TableCell>
                                                                <TableCell>{customer.age}</TableCell>
                                                                <TableCell
                                                                    align="right">{customer.gender}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </ThemeProvider>
                                            <Typography variant="body2" display="block" mt={2}>
                                                <Link to="/customer-dashboard" className="table-link">
                                                    See more customers
                                                </Link>
                                            </Typography>
                                        </GridPaper>
                                    </>
                            }
                        </Grid>
                    </Grid>
                </Container>
                <Footer/>
            </Stack>
        </>
    )
};

export default Dashboard;