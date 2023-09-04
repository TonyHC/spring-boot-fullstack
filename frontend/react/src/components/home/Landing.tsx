import {NavigateFunction, useNavigate} from "react-router-dom";
import {Button, Container, Stack, Toolbar, Typography} from "@mui/material";
import NavBar from "../navigation/Navbar";
import {ThemeProvider} from "@mui/material/styles";
import {landingTheme} from "../../themes/CustomThemes.tsx";
import Footer from "../shared/Footer.tsx";

interface LandingProps {
    isAuth: boolean;
}

const Landing = ({isAuth}: LandingProps) => {
    const navigate: NavigateFunction = useNavigate();

    const loginClickHandler = (): void => {
        navigate("/login");
    };

    const signUpClickHandler = (): void => {
        navigate("/sign-up");
    };

    const dashboardClickHandler = (): void => {
        navigate("/dashboard");
    };

    return (
        <>
            <NavBar/>
            <Stack direction="column" flexGrow={1}>
                <Toolbar/>
                <Container maxWidth="sm" sx={{
                    display: "flex",
                    flexGrow: 1,
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Stack direction="column">
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
                            flexGrow={1}
                        >
                            {isAuth ?
                                <ThemeProvider theme={landingTheme}>
                                    <Button
                                        color="inherit"
                                        variant="outlined"
                                        onClick={dashboardClickHandler}
                                    >
                                        Dashboard
                                    </Button>
                                </ThemeProvider> :
                                <ThemeProvider theme={landingTheme}>
                                    <Button
                                        color="inherit"
                                        variant="outlined"
                                        onClick={loginClickHandler}
                                    >
                                        Sign in
                                    </Button>
                                    <Button
                                        color="inherit"
                                        variant="outlined"
                                        onClick={signUpClickHandler}
                                    >
                                        Sign up
                                    </Button>
                                </ThemeProvider>
                            }
                        </Stack>
                    </Stack>
                </Container>
                <Footer/>
            </Stack>
        </>
    );
};

export default Landing;
