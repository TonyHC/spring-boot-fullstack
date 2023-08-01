import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from "react-router-dom";

import {Box, Button, Stack, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import NavBar from "../navigation/Navbar.tsx";
import {loginTheme} from "../../themes/CustomThemes.tsx";
import {loginRequest} from "../../store/auth/AuthActions.tsx";
import {FireAlert} from "../ui/Alert.tsx";
import {ServerError} from "../../store/customer/CustomerActions.tsx";
import {CustomTextInput} from "../ui/TextField.tsx";
import Footer from "../shared/Footer.tsx";

interface LoginProps {
    onLogin: (user: loginRequest) => Promise<void>;
    error: ServerError | undefined;
}

const Login = ({onLogin, error}: LoginProps) => {
    return (
        <>
            <NavBar/>
            <Stack direction="column" flexGrow={1}>
                <Box
                    id="login"
                    sx={{
                        width: 380,
                        height: "auto",
                        m: "auto",
                        outline: "1px solid #E0E3E7",
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
                        p: 5
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h3"
                        textAlign="center"
                        fontFamily="monospace"
                    >
                        Sign in
                    </Typography>

                    {(error && error.message) &&
                        <FireAlert variant="outlined" severity="error" color="error">
                            {error.message}
                        </FireAlert>
                    }

                    <Formik
                        initialValues={{
                            username: "",
                            password: ""
                        }}
                        validateOnMount={true}
                        validationSchema={Yup.object({
                            username: Yup.string()
                                .email('Must be a valid email')
                                .required("Email is required"),
                            password: Yup.string()
                                .min(6, "Password cannot be less than 6 characters")
                                .max(30, "Password cannot be more than 30 characters")
                                .required("Password is required")
                        })}
                        onSubmit={(user, {setSubmitting}) => {
                            setSubmitting(true);
                            void onLogin(user);
                        }}>
                        {({isValid, dirty}) => (
                            <Form>
                                <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    mt={3}
                                    flexGrow={1}
                                >
                                    <ThemeProvider theme={loginTheme}>
                                        <CustomTextInput
                                            id="username"
                                            label="Username"
                                            name="username"
                                            type="text"
                                            placeholder="example@gmail.com"
                                        />
                                        <CustomTextInput
                                            id="password"
                                            label="Password"
                                            name="password"
                                            type="password"
                                            placeholder="example"
                                        />
                                        <Button
                                            disabled={!(isValid && dirty)}
                                            color="inherit"
                                            variant="outlined"
                                            type="submit"
                                            fullWidth
                                            sx={{
                                                fontFamily: "monospace",
                                                fontWeight: 700
                                            }}>
                                            Sign in
                                        </Button>
                                        <Typography variant="caption" display="block" mt={3} mb={-3}>
                                            New to DEMO? <Link to="/sign-up">Join Now</Link>
                                        </Typography>
                                    </ThemeProvider>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Box>
                <Footer />
            </Stack>
        </>
    );
};

export default Login;
