import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    AppBar,
    Autocomplete,
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Skeleton,
    Stack,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {AccountCircle, Adb as AdbIcon, Logout, PersonAdd, Settings} from "@mui/icons-material/";
import {RootState} from "../../store/Store.tsx";
import {navbarTheme} from "../../themes/CustomThemes.tsx";
import {logout} from "../../utils/AuthUtils.tsx";

interface NavBarProps {
    showAutocomplete?: boolean;
    status?: string;
}

const NavBar = ({showAutocomplete, status}: NavBarProps) => {
    const {isAuth, user} = useSelector((state: RootState) => state.auth);
    const {customers, customerPage} = useSelector((state: RootState) => state.customer);
    const navigate = useNavigate();

    const [value, setValue] = React.useState<string | null>(customerPage.query);
    const [inputValue, setInputValue] = React.useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        setValue(customerPage.query);
    }, [customerPage.query]);

    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const homeClickHandler = (): void => {
        navigate("/");
    };

    const loginClickHandler = (): void => {
        navigate("/login");
    };

    const dashboardClickHandler = (): void => {
        setAnchorEl(null);
        navigate("/dashboard");
    };

    const userProfileClickHandler = (): void => {
        setAnchorEl(null);
        navigate("/profile");
    };

    const logoutHandler = (): void => {
        setAnchorEl(null);
        void logout();
        navigate("/login", {replace: true});
    }

    return (
        <ThemeProvider theme={navbarTheme}>
            <AppBar color="inherit" position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar disableGutters>
                    <Stack direction="row">
                        <Button
                            color="inherit"
                            variant="text"
                            startIcon={<AdbIcon/>}
                            sx={{
                                mx: 3
                            }}
                            onClick={homeClickHandler}
                        >
                            <Typography
                                variant="button"
                                display="block"
                                sx={{
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}>
                                DEMO
                            </Typography>
                        </Button>
                    </Stack>
                    {!isAuth ? <Button
                            color="inherit"
                            variant="outlined"
                            sx={{
                                marginLeft: "auto",
                                marginRight: 4,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                "&:hover": {
                                    backgroundColor: "#90a4ae",
                                    boxShadow: "none"
                                }
                            }}
                            onClick={loginClickHandler}
                        >
                            Login
                        </Button> :
                        <>
                            {
                                showAutocomplete ?
                                    <>
                                        {
                                            status === "loading" ?
                                                <Skeleton width={400} height={65} sx={{mx: "auto"}}/> :
                                                <Autocomplete
                                                    freeSolo
                                                    clearOnEscape={true}
                                                    disablePortal={true}
                                                    size="small"
                                                    value={value}
                                                    onChange={(_event: any, newValue: string | null) => {
                                                        if (newValue !== null) {
                                                            setValue(newValue);
                                                            navigate(`/customer-dashboard/${newValue}`);
                                                        }
                                                    }}
                                                    inputValue={inputValue}
                                                    onInputChange={(_event, newInputValue) => {
                                                        setInputValue(newInputValue);
                                                    }}
                                                    id="controllable-customers-demo"
                                                    options={customers.map((customer) => customer.email)}
                                                    renderInput={(params) => <TextField {...params}
                                                                                        label="Search Customers"/>}
                                                />
                                        }
                                    </> :
                                    <Box sx={{flexGrow: 1}}/>
                            }

                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{mr: 2}}
                                    aria-controls={open ? "account-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}>
                                    <Avatar sx={{
                                        width: 32,
                                        height: 32
                                    }}>{user.firstName ? user.firstName.substring(0, 1) : "U"}</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                            overflow: "visible",
                                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                            mt: 1.5,
                                            "& .MuiAvatar-root": {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1
                                            },
                                            "&:before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: "background.paper",
                                                transform: "translateY(-50%) rotate(45deg)",
                                                zIndex: 0
                                            }
                                        }
                                    }
                                }}
                                transformOrigin={{horizontal: "right", vertical: "top"}}
                                anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                            >
                                <MenuItem onClick={dashboardClickHandler}>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small"/>
                                    </ListItemIcon>
                                    Dashboard
                                </MenuItem>
                                <MenuItem onClick={userProfileClickHandler}>
                                    <ListItemIcon>
                                        <AccountCircle fontSize="medium"/>
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Settings fontSize="small"/>
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <Divider sx={{borderColor: "#90a4ae"}}/>
                                <MenuItem onClick={logoutHandler}>
                                    <ListItemIcon>
                                        <Logout fontSize="small"/>
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    }
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default NavBar;
