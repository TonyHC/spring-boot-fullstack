import {Form, Formik, FormikValues} from 'formik';
import * as Yup from 'yup';

import {Box, Button, CircularProgress, MenuItem, Stack, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import NavBar from "../navigation/Navbar.tsx";
import {Customer} from "../../store/customer/CustomerSlice.tsx";
import {customerFormTheme} from "../../themes/CustomThemes.tsx";
import {FireAlert} from "../ui/Alert.tsx";
import {ServerError} from "../../store/customer/CustomerActions.tsx";
import {CustomTextInput} from "../ui/TextField.tsx";
import {CustomSelect} from "../ui/Select.tsx";

interface UserHomeProps {
    editMode: boolean;
    status: string;
    error: ServerError | undefined;
    actionType?: string;
    onCreateCustomer?: (customer: FormikValues) => Promise<void>;
    onUpdateCustomer?: (customer: FormikValues, customerId: string) => Promise<void>;
    existingCustomer?: Customer;
}

const CustomerForm = (
    {status, error, editMode, actionType, onCreateCustomer, onUpdateCustomer, existingCustomer}: UserHomeProps
) => {
    const initialFormValues = (editMode) ? {
        firstName: existingCustomer ? existingCustomer.firstName : "",
        lastName: existingCustomer ? existingCustomer.lastName : "",
        email: existingCustomer ? existingCustomer.email : "",
        age: existingCustomer ? existingCustomer.age : 0,
        gender: existingCustomer ? existingCustomer.gender : ""
    } : {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        age: 0,
        gender: ""
    };

    const validationSchema = (editMode) ? Yup.object({
        firstName: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("First name is required"),
        lastName: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("Last name is required"),
        email: Yup.string()
            .email("Must be a valid email")
            .required("Email is required"),
        age: Yup.number()
            .min(16, "Must be at least 16 years old")
            .max(100, "Must be less than 100 years old")
            .required("Age is required"),
        gender: Yup.string()
            .oneOf(
                ['MALE', 'FEMALE'],
                "Select a gender"
            )
            .required("Gender is required")
    }) : Yup.object({
        firstName: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("First name is required"),
        lastName: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("Last name is required"),
        email: Yup.string()
            .email('Must be a valid email')
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password cannot be less than 6 characters")
            .max(30, "Password cannot be more than 30 characters")
            .required("Password is required"),
        age: Yup.number()
            .min(16, 'Must be at least 16 years old')
            .max(100, 'Must be less than 100 years old')
            .required("Age is required"),
        gender: Yup.string()
            .oneOf(
                ['MALE', 'FEMALE'],
                "Select a gender"
            )
            .required('Gender is required')
    });

    return (
        <>
            <NavBar/>
            {
                (status === "loading" && actionType === "customer/getCustomerById") ?
                    <CircularProgress sx={{m: "auto"}}/> :
                    <>
                        <Box
                            sx={{
                                width: "auto",
                                height: "auto",
                                mt: 12,
                                mb: 5,
                                mx: "auto",
                                outline: "1px solid #E0E3E7",
                                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
                                p: 5
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h4"
                                textAlign="center"
                                fontFamily="monospace"
                            >
                                {onCreateCustomer ? "Create customer" : onUpdateCustomer ? "Update customer" : "Create account"}
                            </Typography>

                            {(error && error.message) &&
                                <FireAlert variant="outlined" severity="error" color="error">
                                    {error.message}
                                </FireAlert>
                            }

                            <Formik
                                enableReinitialize={true}
                                initialValues={initialFormValues}
                                validateOnMount={true}
                                validationSchema={validationSchema}
                                onSubmit={(customer, {setSubmitting}) => {
                                    if (editMode && onUpdateCustomer && existingCustomer) {
                                        void onUpdateCustomer(customer, existingCustomer.id.toString());
                                    }

                                    if (!editMode && onCreateCustomer) {
                                        void onCreateCustomer(customer);
                                    }

                                    setSubmitting(true);
                                }}
                            >
                                {({isValid, dirty, isSubmitting}) => (
                                    <Form>
                                        <Stack
                                            direction="column"
                                            justifyContent="center"
                                            alignItems="center"
                                            mt={3}
                                            flexGrow={1}
                                        >
                                            <ThemeProvider theme={customerFormTheme}>
                                                <CustomTextInput
                                                    id="firstName"
                                                    label="First Name"
                                                    name="firstName"
                                                    type="text"
                                                    placeholder="Test"
                                                />
                                                <CustomTextInput
                                                    id="lastName"
                                                    label="Last Name"
                                                    name="lastName"
                                                    type="text"
                                                    placeholder="Formik"
                                                />
                                                <CustomTextInput
                                                    id="email"
                                                    label="Email"
                                                    name="email"
                                                    type="text"
                                                    placeholder="test@formik.com"
                                                />
                                                {!editMode && (
                                                    <CustomTextInput
                                                        id="password"
                                                        label="Password"
                                                        name="password"
                                                        type="password"
                                                    />
                                                )}
                                                <CustomTextInput
                                                    id="age"
                                                    label="Age"
                                                    name="age"
                                                    type="number"
                                                    placeholder="Enter your age"
                                                />
                                                <CustomSelect
                                                    id="gender-select"
                                                    labelId="gender-select-label"
                                                    label="Gender"
                                                    name="gender"
                                                >
                                                    <MenuItem value="">
                                                        <em>Select gender</em>
                                                    </MenuItem>
                                                    <MenuItem value="MALE">Male</MenuItem>
                                                    <MenuItem value="FEMALE">Female</MenuItem>
                                                </CustomSelect>
                                                <Button
                                                    disabled={!(isValid && dirty) || isSubmitting}
                                                    color="inherit"
                                                    variant="outlined"
                                                    type="submit"
                                                    fullWidth
                                                    sx={{
                                                        fontFamily: "monospace",
                                                        fontWeight: 700
                                                    }}>
                                                    Submit
                                                </Button>
                                            </ThemeProvider>
                                        </Stack>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </>
            }
        </>
    );
};

export default CustomerForm;