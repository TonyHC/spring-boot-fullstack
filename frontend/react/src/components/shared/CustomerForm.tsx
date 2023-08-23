import {Form, Formik, FormikValues} from 'formik';
import * as Yup from 'yup';
import {Box, Breadcrumbs, Button, MenuItem, Skeleton, Stack, Toolbar, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import NavBar from "../navigation/Navbar.tsx";
import {customerFormTheme} from "../../themes/CustomThemes.tsx";
import {FireAlert} from "../ui/Alert.tsx";
import {CustomTextInput} from "../ui/TextField.tsx";
import {CustomSelect} from "../ui/Select.tsx";
import Footer from "./Footer.tsx";
import {Link} from "react-router-dom";
import {NavigateNext as NavigateNextIcon} from "@mui/icons-material";
import {buildCloudinaryImagePath} from "../../utils/ImageUtils.tsx";
import {MyDropzone} from "../ui/Dropzone.tsx";
import ProfileBackground from "../../assets/profile-background.jpg";
import {Customer, ServerError} from "../../types";

enum FormTitles {
    CreateAccount = "Create Account",
    CreateCustomer = "Create Customer",
    UpdateCustomer = "Update Customer"
}

const createBreadCrumbs = (formTitle: string, path: string) => {
    return [
        <Link to="/dashboard" key="1">Dashboard</Link>,
        path.includes("/customer-form") ?
            <Link to="/customer-dashboard" key="2">Customers</Link> :
            <Link to="/profile" key="2">Profile</Link>,
        <Typography key="3">
            {formTitle}
        </Typography>
    ];
};

interface CustomerFormProps {
    editMode: boolean;
    status: string;
    error: ServerError | undefined;
    isAuth: boolean;
    path: string;
    actionType?: string;
    onCreateCustomer?: (customer: FormikValues) => Promise<void>;
    onUpdateCustomer?: (customer: FormikValues, customerId: string) => Promise<void>;
    onUploadCustomerProfileImage?: (customerId: string, formData: FormData, provider: string) => Promise<void>;
    existingCustomer?: Customer;
}

const CustomerForm = (
    {
        status, error, editMode, isAuth, path, actionType, onCreateCustomer,
        onUpdateCustomer, onUploadCustomerProfileImage, existingCustomer
    }: CustomerFormProps
) => {
    const breadCrumbTitle: FormTitles = !isAuth ? FormTitles.CreateAccount :
        onCreateCustomer ? FormTitles.CreateCustomer : FormTitles.UpdateCustomer;

    const initialFormValues = (editMode) ? {
        firstName: existingCustomer && !(error && error.message) ? existingCustomer.firstName : "",
        lastName: existingCustomer && !(error && error.message) ? existingCustomer.lastName : "",
        email: existingCustomer && !(error && error.message) ? existingCustomer.email : "",
        age: existingCustomer && !(error && error.message) ? existingCustomer.age : 18,
        gender: existingCustomer && !(error && error.message) ? existingCustomer.gender : ""
    } : {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        age: 18,
        gender: ""
    };

    console.log(actionType)
    console.log(error)

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
            .min(18, "Must be at least 18 years old")
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
            .min(18, 'Must be at least 18 years old')
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
            <Stack direction="column" flexGrow={1}>
                {
                    <>
                        {
                            isAuth &&
                            <>
                                <Toolbar/>
                                <Breadcrumbs
                                    separator={<NavigateNextIcon fontSize="small"/>}
                                    aria-label="breadcrumb"
                                    sx={{mt: 2}}>
                                    {(status === "loading" && actionType !== "customer/uploadCustomerProfileImage") ?
                                        <Skeleton width={350}/> : createBreadCrumbs(breadCrumbTitle, path)}
                                </Breadcrumbs>
                            </>
                        }
                        <Box
                            sx={{
                                width: "auto",
                                height: "auto",
                                my: 5,
                                mx: "auto",
                                outline: "1px solid #E0E3E7",
                                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
                                p: 5
                            }}
                        >
                            {
                                (status === "loading" && actionType === "customer/getCustomerById") ?
                                    <Skeleton height={900} width={300} sx={{mt: -25, mb: -20}}/> :
                                    <>
                                        <Typography
                                            variant="h4"
                                            component="h4"
                                            textAlign="center"
                                            fontFamily="monospace"
                                        >
                                            {breadCrumbTitle}
                                        </Typography>
                                        {(error && error.message) &&
                                            <FireAlert variant="outlined" severity="error" color="error">
                                                {error.message}
                                            </FireAlert>
                                        }
                                        {
                                            (editMode && existingCustomer && onUploadCustomerProfileImage && !(error && error.message)) &&
                                            <>
                                                <Box
                                                    component="img"
                                                    sx={{
                                                        height: 233,
                                                        width: 350,
                                                        maxHeight: {xs: 233, md: 167},
                                                        maxWidth: {xs: 350, md: 250},
                                                        mt: 2,
                                                        mb: 3,
                                                        mx: 'auto',
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        objectFit: 'contain'
                                                    }}
                                                    alt="Profile Image"
                                                    src={
                                                        existingCustomer.profileImage !== null ?
                                                            buildCloudinaryImagePath(existingCustomer.profileImage) :
                                                            ProfileBackground
                                                    }
                                                />
                                                <MyDropzone customerId={existingCustomer.id.toString()}
                                                            onUploadCustomerProfileImage={onUploadCustomerProfileImage}
                                                            sx={{
                                                                py: 0.5,
                                                                px: 2,
                                                                mt: 2,
                                                                border: '1px solid #E0E3E7',
                                                                borderRadius: 1
                                                            }}/>
                                            </>
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
                                                            {(!editMode && onCreateCustomer) && (
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
                                                                disabled={!(isValid && dirty) || isSubmitting || !!(error && error.message)}
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
                                    </>
                            }
                            {
                                !isAuth &&
                                <Typography variant="caption" display="block" mt={3} mb={-3} textAlign="center">
                                    Already have a account? <Link to="/login">Sign in</Link>
                                </Typography>
                            }
                        </Box>
                    </>
                }
                <Footer/>
            </Stack>
        </>
    );
};

export default CustomerForm;