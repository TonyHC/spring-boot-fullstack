import {Box, Link, Typography} from "@mui/material";

const Footer = () => {
    const currentYear: number = new Date().getFullYear();

    return (
        <>
            <Box sx={{p: 2, display: "flex", flexDirection: "column"}} component="footer">
                <Typography variant="body2" align="center">
                    {`Copyright © ${currentYear} `}
                    <Link color="inherit" href="https://github.com/TonyHC" underline="none">
                        Demo
                    </Link>
                </Typography>
            </Box>
        </>
    );
};

export default Footer;