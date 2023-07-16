import {FieldHookConfig, Form, Formik, useField} from 'formik';
import * as Yup from 'yup';

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import NavBar from "../navigation/Navbar";
import {createCustomer} from "../../store/actions/CustomerActions.tsx";
import {Customer} from "../../store/slices/CustomerSlice.tsx";
import {customerFormTheme} from "../../themes/CustomThemes.tsx";

type BaseTextFieldProps = FieldHookConfig<string> & {
    id: string,
    label: string,
    type: string,
    placeholder: string
};

const CustomTextInput = (props: BaseTextFieldProps) => {
    const [field, meta] = useField(props);

    return (
        <>
            <TextField fullWidth id={props.id} label={props.label} variant="outlined"
                       type={props.type} className="text-input" placeholder={props.placeholder} {...field}
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

type BaseSelectProps = FieldHookConfig<string> & {
    labelId: string,
    id: string,
    label: string,
    name: string
};

const CustomSelect = ({label, ...props}: BaseSelectProps) => {
    const [field, meta] = useField(props);

    return (
        <>
            <FormControl fullWidth>
                <InputLabel id={props.labelId}>{label}</InputLabel>
                <Select
                    id={props.id}
                    labelId={props.labelId}
                    label={label}
                    defaultValue=""
                    {...field}
                >
                    <MenuItem value="">
                        <em>Select gender</em>
                    </MenuItem>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                </Select>
            </FormControl>
            {meta.touched && meta.error ? (
                <Alert className="error" variant="outlined" severity="error" color="error"
                       sx={{width: "100%", mt: -1, mb: 2}}>
                    {meta.error}
                </Alert>
            ) : null}
        </>
    );
};

interface UserHomeProps {
    editMode?: boolean;
    status?: string;
    actionType?: string;
    onCreateCustomer?: (customer: createCustomer) => Promise<void>;
    onUpdateCustomer?: (customer: createCustomer, customerId: string) => Promise<void>;
    existingCustomer?: Customer;
}

const CustomerForm = ({status, editMode, actionType, onCreateCustomer, onUpdateCustomer, existingCustomer}: UserHomeProps) => {
    return (
        <>
            <NavBar/>
            {
                (status === "loading" && actionType === "customer/getCustomerById") ? <CircularProgress sx={{m: "auto"}}/> :
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
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    firstName: existingCustomer ? existingCustomer.firstName : "",
                                    lastName: existingCustomer? existingCustomer.lastName : "",
                                    email: existingCustomer ? existingCustomer.email : "",
                                    age: existingCustomer ? existingCustomer.age : 0,
                                    gender: existingCustomer ? existingCustomer.gender : ""
                                }}
                                validationSchema={Yup.object({
                                    firstName: Yup.string()
                                        .max(30, 'Must be 30 characters or less')
                                        .required('Required'),
                                    lastName: Yup.string()
                                        .max(30, 'Must be 30 characters or less')
                                        .required('Required'),
                                    email: Yup.string()
                                        .email('Must be a valid email')
                                        .required('Required'),
                                    age: Yup.number()
                                        .min(16, 'Must be at least 16 years old')
                                        .max(100, 'Must be less than 100 years old')
                                        .required(),
                                    gender: Yup.string()
                                        .oneOf(
                                            ['MALE', 'FEMALE'],
                                            'Invalid gender'
                                        )
                                        .required('Required')
                                })}
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
                                                    placeholder="Jane"
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
                                                    placeholder="jane@formik.com"
                                                />
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
                                                />
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