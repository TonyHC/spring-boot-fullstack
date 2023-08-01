import {Container} from "@mui/material";
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
    return (
        <Container maxWidth="xl" sx={{display: "flex", minHeight: "100vh"}}>
            {children}
        </Container>
    );
};

export default Layout;