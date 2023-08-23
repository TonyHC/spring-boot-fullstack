import {resetCustomerPassword} from "../../store/customer/CustomerActions.tsx";
import {Box, Button, Stack, Typography} from "@mui/material";
import {FireAlert} from "../ui/Alert.tsx";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {ThemeProvider} from "@mui/material/styles";
import {CustomTextInput} from "../ui/TextField.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/Store.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import React from "react";
import {resetPasswordTheme} from "../../themes/CustomThemes.tsx";
import {ServerError} from "../../types";

interface ResetPasswordProps {
    error: ServerError | undefined;
    customerId: string;
    setValue: React.Dispatch<React.SetStateAction<number>>;
}

const ResetPassword = ({error, customerId, setValue}: ResetPasswordProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate: NavigateFunction = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <Stack direction="column" flexGrow={1}>
            <Box
                sx={{
                    width: "auto",
                    height: "auto",
                    m: "auto",
                    outline: "1px solid grey",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
                    p: 5
                }}
                key={customerId}
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
                        < FireAlert variant="outlined" severity="error" color="error">
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
                        void dispatch(resetCustomerPassword({
                            customerId,
                            resetPassword,
                            navigate,
                            enqueueSnackbar,
                            setValue
                        }))
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