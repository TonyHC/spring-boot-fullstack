import {Box, Container} from "@mui/material";
import React from "react";

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({children}: LayoutProps) => {
    return (
        <Container maxWidth="xl">
            <Box sx={{display: "flex", minHeight: "100vh"}}>
                {children}
            </Box>
        </Container>
    );
};

export default Layout;