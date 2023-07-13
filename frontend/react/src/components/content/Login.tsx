import {FieldHookConfig, Form, Formik, useField} from 'formik';
import * as Yup from 'yup';
import {Link} from "react-router-dom";

import {Alert, Box, Button, Stack, TextField, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import NavBar from "../navigation/Navbar";
import {loginTheme} from "../../themes/CustomThemes.tsx";

type BaseTextFieldProps = FieldHookConfig<string> & {
    id: string,
    label: string,
    name: string,
    type: string,
    placeholder: string
};

const CustomInputText = (props: BaseTextFieldProps) => {
    const [field, meta] = useField(props);

    return (
        <>
            <TextField fullWidth id={props.id} label={props.label} variant="outlined"
                       type={props.type} className="text-input" {...field}
            />
            {meta.touched && meta.error ? (
                <Alert className="error" variant="outlined" severity="error" color="error"
                       sx={{width: "100%", mt: -1, mb: 2}}>
                    {meta.error}
                </Alert>
            ) : null}
        </>
    );
};

const Login = () => {
    return (
        <>
            <NavBar/>
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
                <Formik
                    initialValues={{
                        username: "",
                        password: ""
                    }}
                    validationSchema={Yup.object({
                        username: Yup.string()
                            .email('Must be a valid email')
                            .required("Required"),
                        password: Yup.string()
                            .max(30, "Must be between 6 and 30 characters long")
                            .required("Required")
                    })}
                    onSubmit={(user, {setSubmitting}) => {
                        setSubmitting(true);
                        console.log(user);
                    }}>
                    {({isValid, isSubmitting}) => (
                        <Form>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                mt={3}
                                flexGrow={1}
                            >
                                <ThemeProvider theme={loginTheme}>
                                    <CustomInputText
                                        id="username"
                                        label="Username"
                                        name="username"
                                        type="text"
                                        placeholder="example@gmail.com"
                                    />
                                    <CustomInputText
                                        id="password"
                                        label="Password"
                                        name="password"
                                        type="text"
                                        placeholder="example"
                                    />
                                    <Button
                                        disabled={!isValid || isSubmitting}
                                        color="inherit"
                                        variant="outlined"
                                        type="submit"
                                        fullWidth
                                        sx={{
                                            fontFamily: "monospace",
                                            fontWeight: 700,
                                        }}>
                                        Sign in
                                    </Button>
                                    <Typography variant="caption" display="block" mt={3} mb={-3}>
                                        New to LOGO? <Link to="/sign-up">Join Now</Link>
                                    </Typography>
                                </ThemeProvider>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        </>
    );
};

export default Login;
