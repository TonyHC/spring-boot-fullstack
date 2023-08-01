import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

import {
    AppBar,
    Autocomplete,
    Avatar,
    Button,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";

import {styled, ThemeProvider} from "@mui/material/styles";

import {AccountCircle, Adb as AdbIcon, Logout, PersonAdd, Settings} from "@mui/icons-material/";
import {RootState} from "../../store/Store.tsx";
import {navbarTheme} from "../../themes/CustomThemes.tsx";
import {logout} from "../../utils/AuthUtils.tsx";

const searchResults = [
    {title: "The Shawshank Redemption", year: 1994},
    {title: "The Godfather", year: 1972},
    {title: "The Godfather: Part II", year: 1974},
    {title: "The Dark Knight", year: 2008},
    {title: "12 Angry Men", year: 1957},
    {title: "Schindler's List", year: 1993},
    {title: "Pulp Fiction", year: 1994}
];

const SearchTextField = styled(TextField)({
    "& label.Mui-focused": {
        color: "#A0AAB4"
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#B2BAC2"
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#E0E3E7"
        },
        "&:hover fieldset": {
            borderColor: "#B2BAC2"
        },
        "&.Mui-focused fieldset": {
            borderColor: "#6F7E8C"
        }
    },
    "& .MuiInputLabel-root": {
        color: "#E0E3E7"
    },
    "& .MuiOutlinedInput-input": {
        color: "#A0AAB4"
    }
});

const StyledAutocomplete = styled(Autocomplete)({
    flexGrow: 0.5,
    margin: "0px 16px",
    "& label.Mui-focused": {
        color: "#A0AAB4"
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#B2BAC2"
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#E0E3E7"
        },
        "&:hover fieldset": {
            borderColor: "#B2BAC2"
        },
        "&.Mui-focused fieldset": {
            borderColor: "#6F7E8C"
        },
    },
    "& .MuiInputLabel-root": {
        color: "#E0E3E7"
    },
    "& .MuiOutlinedInput-input": {
        color: "#A0AAB4"
    }
});

const NavBar = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const {isAuth, user} = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input: string = (e.target as HTMLInputElement).value;
        setSearchKeyword(input);
    };

    const handleSearchTextFieldKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ): void => {
        if (e.key == "Enter") {
            console.log((e.target as HTMLInputElement).value);
            setSearchKeyword("");
        }
    };

    const handleAutocompleteKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ): void => {
        if (e.key == "Enter") {
            console.log((e.target as HTMLInputElement).value);
        }
    };

    const homeClickHandler = (): void => {
        navigate("/");
    };

    const loginClickHandler = (): void => {
        navigate("/login");
    };

    const dashboardHandler = (): void => {
        setAnchorEl(null);
        navigate("/dashboard");
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
                    <Stack direction="row" flexGrow={1}>
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
                                marginRight: 5,
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
                            <SearchTextField
                                id="outlined-basic"
                                label="Keyword"
                                variant="outlined"
                                size="small"
                                value={searchKeyword}
                                onChange={handleChange}
                                onKeyDown={handleSearchTextFieldKeyDown}
                            />
                            <StyledAutocomplete
                                id="free-solo-2-demo"
                                disableClearable
                                options={searchResults.map((option) => option.title)}
                                color="white"
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search input"
                                        InputProps={{
                                            ...params.InputProps,
                                            type: "search"
                                        }}
                                    />
                                )}
                                onKeyDown={handleAutocompleteKeyDown}
                            />
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
                                <MenuItem onClick={dashboardHandler}>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small"/>
                                    </ListItemIcon>
                                    Dashboard
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
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
