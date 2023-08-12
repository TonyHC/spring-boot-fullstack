import NavBar from "../navigation/Navbar.tsx";
import {
    Avatar,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    Paper,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    Toolbar,
    Typography
} from "@mui/material";
import {AddPhotoAlternate, ManageAccounts, NavigateNext as NavigateNextIcon, RestartAlt} from '@mui/icons-material';
import SideMenu from "../navigation/SideMenu.tsx";
import {Link, useNavigate} from "react-router-dom";
import {User} from "../../store/auth/AuthSlice.tsx";
import {styled} from "@mui/material/styles";
import React, {JSX} from "react";
import {AccountCircle} from "@mui/icons-material/";
import {buildCloudinaryImagePath} from "../../utils/ImageUtils.tsx";
import {a11yProps, CustomTabPanel} from "../ui/TabPanel.tsx";
import {MyDropzone} from "../ui/Dropzone.tsx";
import ProfileBackground from "../../assets/profile-background.jpg";

const breadcrumbs: JSX.Element[] = [
    <Link to="/dashboard" key="1">Home</Link>,
    <Typography key="2">
        User Profile
    </Typography>,
];

const GridPaper = styled(Paper)<{ component?: React.ElementType }>({
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#B2BAC2'
});

interface UserProfileProps {
    user: User;
    status: string;
    onUploadCustomerProfileImage: (customerId: string, formData: FormData, provider: string) => Promise<void>;
}

const UserProfile = ({user, status, onUploadCustomerProfileImage}: UserProfileProps) => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    const handleChange = (_event: React.SyntheticEvent, newValue: number): void => {
        setValue(newValue);
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
                        separator={<NavigateNextIcon fontSize="small"/>}>
                        {status === "loading" ? <Skeleton width={150}/> : breadcrumbs}
                    </Breadcrumbs>
                    <Grid container spacing={3} mt={2}>
                        <Grid item xs={12} md={8} lg={5} xl={5}>
                            {
                                status === "loading" ? <Skeleton height={375} sx={{mt: -11}}/> :
                                    <GridPaper>
                                        <Typography component="h6" variant="h6" color="text.primary">
                                            Profile
                                        </Typography>
                                        <Divider/>
                                        <Typography component="p" variant="body2" mt={2}>
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
                                        <Typography variant="body2" mt={3} color="text.primary">
                                            Roles: {user.roles}
                                        </Typography>
                                    </GridPaper>
                            }
                        </Grid>
                        <Grid item xs={12} md={4} lg={7} xl={7}>
                            {
                                status === "loading" ? <Skeleton height={550} sx={{mt: -16}}/> :
                                    <GridPaper>
                                        <Box sx={{width: '100%'}}>
                                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                                <Tabs value={value} onChange={handleChange}
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
                                                                Update Information
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
                                                                border: '1px solid #000',
                                                                color: 'black',
                                                                borderRadius: 1,
                                                                textAlign: 'center'
                                                            }}/>
                                            </CustomTabPanel>
                                            <CustomTabPanel value={value} index={2}>
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    fullWidth
                                                    onClick={updateCustomerClickHandler}
                                                >
                                                    Update Information
                                                </Button>
                                            </CustomTabPanel>
                                            <CustomTabPanel value={value} index={3}>
                                                <h2>Implement Reset Password</h2>
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