import {Container, Stack, Typography} from "@mui/material";
import NavBar from "../navigation/Navbar.tsx";
import {Link} from "react-router-dom";
import Footer from "./Footer.tsx";

interface NotFoundProps {
    isAuth: boolean;
}

const NotFound = ({isAuth}: NotFoundProps) => {
    const greaterThanSymbol: string = String.fromCodePoint(0x003E);

    return (
        <>
            <NavBar/>
            <Stack direction="column" flexGrow={1}>
                <Container maxWidth="sm" sx={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Stack direction="column">
                        <Typography variant="h2" component="h2">
                            Whoops!
                        </Typography>
                        <Typography variant="subtitle2" marginTop={2} marginBottom={3}>
                            Sorry, we can't find that page! Don't worry though, everything is still working!
                        </Typography>
                        {
                            isAuth ? <Link to="/dashboard">
                                    <Typography variant="subtitle2">
                                        Return back to the dashboard {greaterThanSymbol}
                                    </Typography>
                                </Link> :
                                <Link to="/dashboard">
                                    <Typography variant="subtitle2">
                                        Return back to the home page {greaterThanSymbol}
                                    </Typography>
                                </Link>
                        }
                    </Stack>
                </Container>
                <Footer/>
            </Stack>
        </>
    );
};

export default NotFound;
