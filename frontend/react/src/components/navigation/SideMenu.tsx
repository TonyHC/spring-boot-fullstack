import React, {useState} from "react";
import {
    Box,
    Collapse,
    Divider,
    Drawer,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Paper,
    Stack,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {styled, ThemeProvider} from "@mui/material/styles";
import {
    Analytics,
    ArrowRight,
    Drafts as DraftsIcon,
    ExpandLess,
    ExpandMore,
    GitHub,
    Home,
    KeyboardArrowDown,
    ManageAccounts,
    MoveToInbox as InboxIcon,
    People,
    Send as SendIcon,
    Settings,
    StarBorder
} from "@mui/icons-material/";
import {sideMenuTheme} from "../../themes/CustomThemes.tsx";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/Store.tsx";
import {toggleOpenActionListState} from "../../store/auth/AuthSlice.tsx";

const drawerWidth = 256;

const buildListData = [
    {icon: <People/>, label: "Customer", path: "/customer-dashboard"},
    {icon: <Analytics/>, label: "Dashboard", path: "/dashboard"},
    {icon: <ManageAccounts/>, label: "Profile", path: "/profile"},
    {icon: <Settings/>, label: "Settings", path: "/dashboard"}
];

const FireNav = styled(List)<{ component?: React.ElementType }>({
    "& .MuiListItemButton-root": {
        paddingLeft: 24,
        paddingRight: 24
    },
    "& .MuiListItemIcon-root": {
        minWidth: 0,
        marginRight: 16
    },
    "& .MuiSvgIcon-root": {
        fontSize: 20
    },
});

const SideMenu = () => {
    const {openActionsList} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [openInboxList, setOpenInboxList] = useState(false);
    const navigate: NavigateFunction = useNavigate();

    const handleClick = (): void => {
        setOpenInboxList(!openInboxList);
    };
    const navigateClickHandler = (path: string): void => {
        navigate(path);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                ["& .MuiDrawer-paper"]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "#000000"
                }
            }}>
            <ThemeProvider theme={sideMenuTheme}>
                <Toolbar/>
                <Box sx={{display: "flex", flexGrow: 1}}>
                    <Paper square elevation={0} sx={{maxWidth: 255, overflow: "hidden"}}>
                        <FireNav component="nav" disablePadding>
                            <Divider/>
                            <ListItem component="div" disablePadding>
                                <ListItemButton sx={{height: 64}} onClick={() => navigateClickHandler('/dashboard')}>
                                    <ListItemIcon>
                                        <Home color="primary"/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Home"
                                        primaryTypographyProps={{
                                            fontWeight: "medium",
                                            variant: "body2"
                                        }}
                                    />
                                </ListItemButton>
                                <Tooltip title="Project Settings">
                                    <IconButton
                                        size="large"
                                        sx={{
                                            "& svg": {
                                                color: "rgba(255,255,255,0.8)",
                                                transition: "0.2s",
                                                transform: "translateX(0) rotate(0)"
                                            },
                                            "&:hover, &:focus": {
                                                bgcolor: "unset",
                                                "& svg:first-of-type": {
                                                    transform: "translateX(-4px) rotate(-20deg)"
                                                },
                                                "& svg:last-of-type": {
                                                    right: 0,
                                                    opacity: 1
                                                }
                                            },
                                            "&:after": {
                                                content: '""',
                                                position: "absolute",
                                                height: "80%",
                                                display: "block",
                                                left: 0,
                                                width: "1px",
                                                bgcolor: "divider"
                                            }
                                        }}
                                    >
                                        <Settings/>
                                        <ArrowRight sx={{position: "absolute", right: 4, opacity: 0}}/>
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                            <Divider/>
                            <Box sx={{bgcolor: openActionsList ? "rgba(71, 98, 130, 0.2)" : null}}>
                                <ListItemButton
                                    alignItems="flex-start"
                                    onClick={() => dispatch(toggleOpenActionListState())}
                                    sx={{
                                        px: 3,
                                        pt: 2.5,
                                        pb: openActionsList ? 0 : 2.5,
                                        "&:hover, &:focus": {
                                            "& svg": {opacity: openActionsList ? 1 : 0}
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary="Actions"
                                        primaryTypographyProps={{
                                            fontSize: 15,
                                            fontWeight: "medium",
                                            lineHeight: "20px",
                                            mb: "2px"
                                        }}
                                        secondary="Customers, Dashboard, Profile, Settings"
                                        secondaryTypographyProps={{
                                            noWrap: true,
                                            fontSize: 12,
                                            lineHeight: "16px",
                                            color: openActionsList ? "rgba(0,0,0,0)" : "rgba(255,255,255,0.5)"
                                        }}
                                        sx={{my: 0}}
                                    />
                                    <KeyboardArrowDown
                                        sx={{
                                            mr: -1,
                                            opacity: 0,
                                            transform: openActionsList ? "rotate(-180deg)" : "rotate(0)",
                                            transition: "0.2s"
                                        }}
                                    />
                                </ListItemButton>
                                {openActionsList &&
                                    buildListData.map((item) => (
                                        <ListItemButton
                                            key={item.label}
                                            sx={{
                                                py: 0,
                                                minHeight: 45,
                                                color: "rgba(255,255,255,.8)"
                                            }}
                                            onClick={() => navigateClickHandler(item.path)}
                                        >
                                            <ListItemIcon sx={{color: "inherit"}}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{
                                                    fontSize: 14,
                                                    fontWeight: "medium"
                                                }}
                                            />
                                        </ListItemButton>
                                    ))}
                            </Box>
                        </FireNav>
                        <List
                            disablePadding
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "background.paper",
                                "& .MuiListItemButton-root": {
                                    paddingLeft: 3
                                },
                                "& .MuiListItemIcon-root": {
                                    minWidth: '40px'
                                }
                            }}
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Nested List Items
                                </ListSubheader>
                            }
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <SendIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Sent mail"/>
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DraftsIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Drafts"/>
                            </ListItemButton>
                            <ListItemButton onClick={handleClick}>
                                <ListItemIcon>
                                    <InboxIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Inbox"/>
                                {openInboxList ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                            <Collapse in={openInboxList} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton sx={{paddingLeft: 2}}
                                                    onClick={() => navigateClickHandler("/dashboard")}>
                                        <ListItemIcon>
                                            <StarBorder/>
                                        </ListItemIcon>
                                        <ListItemText primary="Starred"/>
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </List>
                        <Divider/>
                        <ListItemText
                            sx={{
                                my: 0,
                                padding: 3
                            }}
                            primary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec semper maximus leo,
                            quis iaculis dui vestibulum non. Proin turpis elit, blandit nec nulla sed, posuere ultricies
                            ipsum. Nunc cursus facilisis mi nec sodales."
                            primaryTypographyProps={{
                                fontSize: 12,
                                fontWeight: "medium",
                                letterSpacing: 0
                            }}
                        />
                        <Divider/>
                    </Paper>
                </Box>
                <Box display="flex" sx={{bgcolor: "background.paper"}}>
                    <Stack direction="row" display="flex" alignItems="center" justifyContent="center" px={3} py={2}>
                        <GitHub fontSize="medium" color="primary"/>
                        <Link underline="none" color="inherit" ml={2}
                              href="https://github.com/TonyHC/spring-boot-fullstack">
                            <Typography variant="body2">
                                GitHub
                            </Typography>
                        </Link>
                    </Stack>
                </Box>
            </ThemeProvider>
        </Drawer>
    );
};

export default SideMenu;
