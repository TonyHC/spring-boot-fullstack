import React, {useState} from "react";

import {
    Box,
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Paper,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";

import {styled, ThemeProvider} from "@mui/material/styles";

import {
    ArrowRight,
    Dns,
    Drafts as DraftsIcon,
    ExpandLess,
    ExpandMore,
    GitHub,
    Home,
    KeyboardArrowDown,
    MoveToInbox as InboxIcon,
    People,
    PermMedia,
    Public,
    Send as SendIcon,
    Settings,
    StarBorder
} from "@mui/icons-material/";
import {sideMenuTheme} from "../../themes/CustomThemes.tsx";
import {useNavigate} from "react-router-dom";

const drawerWidth = 256;

const buildListData = [
    {icon: <People/>, label: "Authentication"},
    {icon: <Dns/>, label: "Database"},
    {icon: <PermMedia/>, label: "Storage"},
    {icon: <Public/>, label: "Hosting"}
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

/*
    TODO -> Update the list items of the SideMenu component by either adding links to another component or
    removing unnecessary items
*/

const SideMenu = () => {
    const [openBuildList, setOpenBuildList] = useState(false);
    const [openInboxList, setOpenInboxList] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setOpenInboxList(!openInboxList);
    };

    const dashboardClickHandler = () => {
        navigate("/customer-dashboard");
    };

    const githubClickHandler = () => {
        window.location.assign("https://github.com/TonyHC/spring-boot-fullstack");
    }

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
                                <ListItemButton sx={{height: 64}} onClick={dashboardClickHandler}>
                                    <ListItemIcon>
                                        <Home color="primary"/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Dashboard"
                                        primaryTypographyProps={{
                                            color: "primary",
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
                            <Box sx={{bgcolor: openBuildList ? "rgba(71, 98, 130, 0.2)" : null}}>
                                <ListItemButton
                                    alignItems="flex-start"
                                    onClick={() => setOpenBuildList(!openBuildList)}
                                    sx={{
                                        px: 3,
                                        pt: 2.5,
                                        pb: openBuildList ? 0 : 2.5,
                                        "&:hover, &:focus": {
                                            "& svg": {opacity: openBuildList ? 1 : 0}
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary="Build"
                                        primaryTypographyProps={{
                                            fontSize: 15,
                                            fontWeight: "medium",
                                            lineHeight: "20px",
                                            mb: "2px"
                                        }}
                                        secondary="Authentication, Firestore Database, Realtime Database, Storage, H
                                        osting, Functions, and Machine Learning"
                                        secondaryTypographyProps={{
                                            noWrap: true,
                                            fontSize: 12,
                                            lineHeight: "16px",
                                            color: openBuildList ? "rgba(0,0,0,0)" : "rgba(255,255,255,0.5)"
                                        }}
                                        sx={{my: 0}}
                                    />
                                    <KeyboardArrowDown
                                        sx={{
                                            mr: -1,
                                            opacity: 0,
                                            transform: openBuildList ? "rotate(-180deg)" : "rotate(0)",
                                            transition: "0.2s"
                                        }}
                                    />
                                </ListItemButton>
                                {openBuildList &&
                                    buildListData.map((item) => (
                                        <ListItemButton
                                            key={item.label}
                                            sx={{
                                                py: 0,
                                                minHeight: 45,
                                                color: "rgba(255,255,255,.8)"
                                            }}
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
                                    <ListItemButton sx={{paddingLeft: 2}}>
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
                    <ListItemButton sx={{height: 50, pl: 3}} onClick={githubClickHandler}>
                        <ListItemIcon>
                            <GitHub color="primary"/>
                        </ListItemIcon>
                        <ListItemText sx={{ml: -2}}>
                            <Typography variant="body2">
                                GitHub
                            </Typography>
                        </ListItemText>
                    </ListItemButton>
                </Box>
            </ThemeProvider>
        </Drawer>
    );
};

export default SideMenu;
