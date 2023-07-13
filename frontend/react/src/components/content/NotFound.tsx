import {Container, Typography} from "@mui/material";
import NavBar from "../navigation/Navbar.tsx";
import {Link} from "react-router-dom";

const NotFound = () => {
    const greaterThanSymbol = String.fromCodePoint(0x003E);

    return (
        <>
            <NavBar/>
            <Container maxWidth="sm" sx={{flexGrow: 1, m: "auto"}}>
                <Typography variant="h2" component="h2">
                    Whoops!
                </Typography>
                <Typography variant="subtitle2" marginTop={2} marginBottom={3}>
                    Sorry, we can't find that page! Don't worry though, everything is still working!
                </Typography>
                <Link to="/" style={{textDecoration: "none"}}>
                    <Typography variant="subtitle2" >
                        Return back to the home page {greaterThanSymbol}
                    </Typography>
                </Link>
            </Container>
        </>
    );
};

export default NotFound;
