import NavBar from "../navigation/Navbar.tsx";
import {
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    Toolbar,
    Typography
} from "@mui/material";
import {
    AddPhotoAlternate,
    ManageAccounts,
    NavigateNext as NavigateNextIcon,
    Notes,
    RestartAlt,
    Security
} from '@mui/icons-material';
import SideMenu from "../navigation/SideMenu.tsx";
import {Link, NavigateFunction, useNavigate} from "react-router-dom";
import React, {JSX} from "react";
import {AccountCircle} from "@mui/icons-material/";
import {buildCloudinaryImagePath} from "../../utils/ImageUtils.ts";
import {a11yProps, CustomTabPanel} from "../ui/TabPanel.tsx";
import {MyDropzone} from "../ui/Dropzone.tsx";
import ProfileBackground from "../../assets/profile-background.jpg";
import ResetPassword from "./ResetPassword.tsx";
import {Accordion, AccordionDetails, AccordionSummary} from "../ui/Accordion.tsx";
import {User} from "../../types";
import {GridPaper} from "../ui/GridPaper.tsx";

const breadcrumbs: JSX.Element[] = [
    <Link to="/dashboard" key="1">Home</Link>,
    <Typography key="2">
        User Profile
    </Typography>
];

interface UserProfileProps {
    user: User;
    status: boolean;
    onUploadCustomerProfileImage: (customerId: string, formData: FormData, provider: string) => void;
}

const UserProfile = ({user, status, onUploadCustomerProfileImage}: UserProfileProps) => {
    const [value, setValue] = React.useState(0);
    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const navigate: NavigateFunction = useNavigate();

    const changeTabHandler = (_event: React.SyntheticEvent, newValue: number): void => {
        setValue(newValue);
    };

    const changePanelHandler = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const updateCustomerClickHandler = (): void => {
        navigate(`/profile/${user.id}`);
    };

    return (
        <>
            <NavBar/>
            <SideMenu/>
            <Stack direction="column" flexGrow={1}>
                <Toolbar/>
                <Container maxWidth="xl" sx={{my: 2}}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small"/>}
                        aria-label="breadcrumb"
                    >
                        {status ? <Skeleton width={150}/> : breadcrumbs}
                    </Breadcrumbs>
                    <Grid container spacing={3} mt={2}>
                        <Grid item xs={12} md={12} lg={5} xl={5}>
                            {
                                status ? <Skeleton height={400} sx={{mt: -11}}/> :
                                    <>
                                        <Accordion expanded={expanded === 'panel1'}
                                                   onChange={changePanelHandler('panel1')}>
                                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                                <Stack direction="row" display="flex" alignItems="center"
                                                       justifyContent="center">
                                                    <Notes/>
                                                    <Typography ml={1}>User Details</Typography>
                                                </Stack>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography component="p" variant="body2">
                                                    Name: {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography component="p" variant="body2" mt={1}>
                                                    Email: {user.email}
                                                </Typography>
                                                <Typography component="p" variant="body2" mt={1}>
                                                    Age: {user.age}
                                                </Typography>
                                                <Typography component="p" variant="body2" mt={1}>
                                                    Gender: {user.gender}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expanded === 'panel2'}
                                                   onChange={changePanelHandler('panel2')}>
                                            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                                <Stack direction="row" display="flex" alignItems="center"
                                                       justifyContent="center">
                                                    <Security fontSize="small"/>
                                                    <Typography ml={1}>Security Details</Typography>
                                                </Stack>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2">
                                                    Username: {user.username}
                                                </Typography>
                                                <Typography variant="body2" mt={1}>
                                                    Roles: {user.roles}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </>
                            }
                        </Grid>
                        <Grid item xs={12} md={12} lg={7} xl={7}>
                            {
                                status ? <Skeleton height={625} sx={{mt: -16}}/> :
                                    <GridPaper>
                                        <Box sx={{width: '100%'}}>
                                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                                <Tabs value={value} onChange={changeTabHandler} scrollButtons="auto"
                                                      aria-label=" basic tabs example" centered>
                                                    <Tab icon={<AccountCircle/>}
                                                         label=" Profile Image" {...a11yProps(0)} />
                                                    <Tab icon={<AddPhotoAlternate/>}
                                                         label=" Upload Image" {...a11yProps(1)} />
                                                    <Tab icon={<ManageAccounts/>}
                                                         label="Update User" {...a11yProps(2)} />
                                                    <Tab icon={<RestartAlt/>}
                                                         label="Reset Password" {...a11yProps(3)} />
                                                </Tabs>
                                            </Box>
                                            <CustomTabPanel value={value} index={0}>
                                                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                                    <Stack direction="column">
                                                        <Card sx={{
                                                            maxWidth: 345,
                                                            textAlign: 'center',
                                                            backgroundColor: 'inherit',
                                                            border: '1px solid grey'
                                                        }}>
                                                            <CardContent>
                                                                <Avatar alt="profile-image"
                                                                        src={
                                                                            user.profileImage !== null ?
                                                                                buildCloudinaryImagePath(user.profileImage) :
                                                                                ProfileBackground
                                                                        }
                                                                        sx={{
                                                                            height: 75,
                                                                            width: 75,
                                                                            display: 'block',
                                                                            mx: 'auto',
                                                                            mb: 2
                                                                        }}/>
                                                                <Typography gutterBottom variant="h5" component="div"
                                                                            color="text.secondary">
                                                                    {user.firstName} {user.lastName}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {user.email}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                        <Button
                                                            variant="outlined"
                                                            color="inherit"
                                                            type="submit"
                                                            fullWidth
                                                            onClick={() => setValue(1)}
                                                            sx={{
                                                                fontFamily: "monospace",
                                                                fontWeight: 700,
                                                                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                                                                mt: 2,
                                                                mb: -2,
                                                                border: '1px solid grey'
                                                            }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Upload Image
                                                            </Typography>
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            </CustomTabPanel>
                                            <CustomTabPanel value={value} index={1}>
                                                <MyDropzone customerId={user.id.toString()}
                                                            onUploadCustomerProfileImage={onUploadCustomerProfileImage}
                                                            setValue={setValue}
                                                            sx={{
                                                                py: 0.5,
                                                                px: 3,
                                                                mt: 2,
                                                                border: '1px solid #263238',
                                                                color: 'black',
                                                                borderRadius: 1,
                                                                textAlign: 'center'
                                                            }}/>
                                            </CustomTabPanel>
                                            <CustomTabPanel value={value} index={2}>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    type="submit"
                                                    fullWidth
                                                    onClick={updateCustomerClickHandler}
                                                >
                                                    Update Information
                                                </Button>
                                            </CustomTabPanel>
                                            <CustomTabPanel value={value} index={3}>
                                                <ResetPassword customerId={user.id.toString()} setValue={setValue}/>
                                            </CustomTabPanel>
                                        </Box>
                                    </GridPaper>
                            }
                        </Grid>
                    </Grid>
                </Container>
            </Stack>
        </>
    )
};

export default UserProfile;