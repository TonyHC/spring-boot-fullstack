import {Customer} from "../../../store/slices/CustomerSlice.tsx";
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
    Typography
} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {customerItemTheme} from "../../../themes/CustomThemes.tsx";

interface CustomerItemInterface {
    key: React.Key;
    customer: Customer;
    onDeleteCustomer: (customerId: string | undefined) => void;
}

const CustomerItem = ({customer, onDeleteCustomer}: CustomerItemInterface) => {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const deleteCustomerHandler = () => {
        setOpenDialog(false);
        console.log("Deleting...");
        onDeleteCustomer(customer.id.toString());
    }

    const updateCustomerClickHandler = () => {
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
            >
                <CardMedia
                    sx={{width: 'auto', height: 175}}
                    image="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg"
                    title="placeholder img"
                />
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
                        {customer.firstName} {customer.lastName}
                    </Typography>
                    <Typography color="text.secondary" component={"div"} sx={{fontSize: "0.9rem", color: "inherit"}}>
                        {customer.email}
                    </Typography>
                    <Typography color="text.secondary" component={"div"} sx={{fontSize: "0.9rem", color: "inherit"}}>
                        Age {customer.age} | {customer.gender.substring(0, 1) + customer.gender.substring(1).toLowerCase()}
                    </Typography>
                </CardContent>
                <CardActions sx={{mt: -2}}>
                    <Button size="small" onClick={updateCustomerClickHandler}>Update Info</Button>
                    <Button size="small" color="error" onClick={handleClickOpen}>Delete</Button>
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
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={deleteCustomerHandler} autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </>
    );
};

export default CustomerItem;