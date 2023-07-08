import {Customer} from "../../../store/slices/customer-slice.tsx";
import React from "react";
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";

interface CustomerItemInterface {
    key: React.Key;
    customer: Customer;
}

const CustomerItem = ({customer}: CustomerItemInterface) => {
    return (
        <>
            <Card variant='outlined' sx={{
                backgroundColor: 'inherit',
                m: 2,
                height: '300px',
                width: '250px',
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
            }}>
                <CardMedia
                    sx={{width: 'auto', height: 175}}
                    image="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg"
                    title="green iguana"
                />
                <CardContent>
                    <Typography variant="h5" component={'div'} sx={{
                        fontSize: "1.1rem",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: "inherit",
                        textDecoration: "none",
                    }}>
                        {customer.name}, {customer.age}
                    </Typography>
                    <Typography color="text.secondary" component={'div'} sx={{fontSize: "0.9rem", color: 'inherit'}}>
                        {customer.email}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>

        </>
    );
};

export default CustomerItem;