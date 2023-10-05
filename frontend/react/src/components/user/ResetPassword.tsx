import {resetCustomerPassword} from "../../store/customer/CustomerActions.ts";
import {Box, Button, Stack, Typography} from "@mui/material";
import {FireAlert} from "../ui/Alert.tsx";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {ThemeProvider} from "@mui/material/styles";
import {CustomTextInput} from "../ui/TextField.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import React from "react";
import {resetPasswordTheme} from "../../themes/CustomThemes.ts";
import {useThunk} from "../../hooks/useThunk.ts";

interface ResetPasswordProps {
    customerId: string;
    setValue: React.Dispatch<React.SetStateAction<number>>;
}

const ResetPassword = ({customerId, setValue}: ResetPasswordProps) => {
    const navigate: NavigateFunction = useNavigate();
    const {enqueueSnackbar} = useSnackbar();
    const {runThunk: runResetCustomerPassword, error} = useThunk(resetCustomerPassword);

    return (
        <Stack direction="column" flexGrow={1} key={customerId}>
            <Box
                sx={{
                    width: "auto",
                    height: "auto",
                    m: "auto",
                    outline: "1px solid grey",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
                    p: 5
                }}
            >
                <Typography
                    variant="h3"
                    component="h3"
                    textAlign="center"
                    fontFamily="monospace"
                    color="#263238"
                >
                    Reset Password
                </Typography>
                {
                    error && error.message && error.message.split(",").map(errorMessage => (
                        < FireAlert variant="outlined" severity="error" color="error" key={errorMessage}>
                            {errorMessage}
                        </FireAlert>
                    ))
                }
                <Formik
                    initialValues={{
                        password: "",
                        confirmPassword: ""
                    }}
                    validateOnMount={true}
                    validationSchema={Yup.object({
                        password: Yup.string()
                            .min(6, "Password cannot be less than 6 characters")
                            .max(30, "Password cannot be more than 30 characters")
                            .required("Password is required"),
                        confirmPassword: Yup.string()
                            .min(6, "Password cannot be less than 6 characters")
                            .max(30, "Password cannot be more than 30 characters")
                            .required("Password is required")
                    })}
                    onSubmit={(resetPassword, {setSubmitting}) => {
                        setSubmitting(true);
                        runResetCustomerPassword({
                            customerId,
                            resetPassword,
                            navigate,
                            enqueueSnackbar,
                            setValue
                        });
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
                                <ThemeProvider theme={resetPasswordTheme}>
                                    <CustomTextInput
                                        id="password"
                                        label="Password"
                                        name="password"
                                        type="password"
                                    />
                                    <CustomTextInput
                                        id="confirmPassword"
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                    />
                                    <Button
                                        disabled={!(isValid && dirty)}
                                        variant="outlined"
                                        type="submit"
                                        fullWidth
                                    >
                                        Submit
                                    </Button>
                                </ThemeProvider>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Stack>
    )
};

export default ResetPassword;