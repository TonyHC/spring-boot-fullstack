import {useNavigate} from "react-router-dom";
import {Button, Container, Stack, Typography} from "@mui/material";
import NavBar from "../navigation/Navbar";
import {ThemeProvider} from "@mui/material/styles";
import {landingTheme} from "../../themes/CustomThemes.tsx";

const Landing = () => {
    const navigate = useNavigate();

    const loginClickHandler = () => {
        navigate("/login");
    };

    const signUpClickHandler = () => {
        navigate("/sign-up");
    };

    return (
        <>
            <NavBar/>
            <Container maxWidth="sm" sx={{flexGrow: 1, textAlign: "center", m: "auto"}}>
                <Typography variant="h2" component="h2">
                    Landing Page
                </Typography>
                <Typography variant="subtitle2" marginTop={2} marginBottom={3}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                >
                    <ThemeProvider theme={landingTheme}>
                        <Button
                            color="inherit"
                            variant="outlined"
                            onClick={loginClickHandler}
                        >
                            Login
                        </Button>
                        <Button
                            color="inherit"
                            variant="outlined"
                            onClick={signUpClickHandler}
                        >
                            Sign up
                        </Button>
                    </ThemeProvider>
                </Stack>
            </Container>
        </>
    );
};

export default Landing;
