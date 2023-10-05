import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Skeleton,
    Typography
} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {customerItemTheme} from "../../themes/CustomThemes.ts";
import {buildCloudinaryImagePath} from "../../utils/ImageUtils.ts";
import ProfileBackground from "../../assets/profile-background.jpg";
import {Customer} from "../../types";

interface CustomerItemProps {
    key: React.Key;
    customer: Customer;
    status: boolean;
    onDeleteCustomer: (customerId: string) => void;
}

const CustomerItem = ({customer, status, onDeleteCustomer}: CustomerItemProps) => {
    const navigate: NavigateFunction = useNavigate();
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpen = (): void => {
        setOpenDialog(true);
    };

    const handleClose = (): void => {
        setOpenDialog(false);
    };

    const deleteCustomerHandler = (): void => {
        setOpenDialog(false);
        void onDeleteCustomer(customer.id.toString());
    };

    const updateCustomerClickHandler = (): void => {
        navigate(`/customer-form/${customer.id}`);
    };

    return (
        <>
            <Card
                variant='outlined'
                sx={{
                    backgroundColor: 'inherit',
                    m: 2,
                    height: '300px',
                    width: '260px',
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;"
                }}
                data-testid="customer-card"
            >
                {
                    status ? <Skeleton height={280} sx={{mt: -7.5, mb: -6}}/> :
                        <CardMedia
                            sx={{width: 'auto', height: 175}}
                            image={
                                customer.profileImage !== null ?
                                    buildCloudinaryImagePath(customer.profileImage) :
                                    ProfileBackground
                            }
                            title="placeholder img"
                        />
                }
                <CardContent>
                    <Typography
                        variant="h5"
                        component={"div"}
                        sx={{
                            fontSize: "1.1rem",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none"
                        }}>
                        {status ? <Skeleton/> : `${customer.firstName} ${customer.lastName}`}
                    </Typography>
                    <Typography color="text.secondary" component={"div"} sx={{fontSize: "0.9rem", color: "inherit"}}>
                        {status ? <Skeleton/> : `${customer.email}`}
                    </Typography>
                    <Typography color="text.secondary" component={"div"} sx={{fontSize: "0.9rem", color: "inherit"}}>
                        {status ?
                            <Skeleton/> : `Age ${customer.age} |  ${customer.gender.substring(0, 1) + customer.gender.substring(1).toLowerCase()}`}
                    </Typography>
                </CardContent>
                <CardActions sx={{mt: -2}}>
                    <Button size="small" onClick={updateCustomerClickHandler}>
                        {status ? <Skeleton width={50}/> : 'Update Info'}
                    </Button>
                    <Button size="small" color="error" onClick={handleClickOpen}>
                        {status ? <Skeleton width={50}/> : 'Delete'}
                    </Button>
                </CardActions>
            </Card>
            <ThemeProvider theme={customerItemTheme}>
                <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Delete this customer?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            By clicking on agree, {customer.firstName} {customer.lastName} will be delete.
                            This process is irreversible and all data about
                            this {customer.firstName} {customer.lastName} will be lost forever.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleClose}>Disagree</Button>
                        <Button color="error" onClick={deleteCustomerHandler} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </>
    );
};

export default CustomerItem;