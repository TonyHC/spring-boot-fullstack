import * as React from "react";

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
} from "@mui/material";

import {createTheme, styled, ThemeProvider} from "@mui/material/styles";

import {
    ArrowRight,
    Dns,
    Drafts as DraftsIcon,
    ExpandLess,
    ExpandMore,
    Home,
    KeyboardArrowDown,
    MoveToInbox as InboxIcon,
    People,
    PermMedia,
    Public,
    Send as SendIcon,
    Settings,
    StarBorder,
} from "@mui/icons-material/";

const drawerWidth = 256;

const data = [
    {icon: <People/>, label: "Authentication"},
    {icon: <Dns/>, label: "Database"},
    {icon: <PermMedia/>, label: "Storage"},
    {icon: <Public/>, label: "Hosting"},
];

const FireNav = styled(List)<{ component?: React.ElementType }>({
    "& .MuiListItemButton-root": {
        paddingLeft: 24,
        paddingRight: 24,
    },
    "& .MuiListItemIcon-root": {
        minWidth: 0,
        marginRight: 16,
    },
    "& .MuiSvgIcon-root": {
        fontSize: 20,
    },
});

const SideMenu = () => {
    const [open, setOpen] = React.useState(false);
    const [openTwo, setOpenTwo] = React.useState(false);

    const handleClick = () => {
        setOpenTwo(!openTwo);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "#000000",
                },
            }}
        >
            <ThemeProvider
                theme={createTheme({
                    components: {
                        MuiListItemButton: {
                            defaultProps: {
                                disableTouchRipple: false,
                            },
                        },
                    },
                    palette: {
                        mode: "dark",
                        primary: {main: "rgb(102, 157, 246)"},
                        background: {paper: "rgb(5, 30, 52)"},
                    },
                })}
            >
                <Toolbar/>
                <Box
                    sx={{
                        display: "flex",
                        flexGrow: 1,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{maxWidth: 255, overflow: "hidden"}}
                        square
                    >
                        <FireNav component="nav" disablePadding>
                            <Divider/>
                            <ListItem component="div" disablePadding>
                                <ListItemButton sx={{height: 64}}>
                                    <ListItemIcon>
                                        <Home color="primary"/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Project Overview"
                                        primaryTypographyProps={{
                                            color: "primary",
                                            fontWeight: "medium",
                                            variant: "body2",
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
                                                transform: "translateX(0) rotate(0)",
                                            },
                                            "&:hover, &:focus": {
                                                bgcolor: "unset",
                                                "& svg:first-of-type": {
                                                    transform: "translateX(-4px) rotate(-20deg)",
                                                },
                                                "& svg:last-of-type": {
                                                    right: 0,
                                                    opacity: 1,
                                                },
                                            },
                                            "&:after": {
                                                content: '""',
                                                position: "absolute",
                                                height: "80%",
                                                display: "block",
                                                left: 0,
                                                width: "1px",
                                                bgcolor: "divider",
                                            },
                                        }}
                                    >
                                        <Settings/>
                                        <ArrowRight
                                            sx={{position: "absolute", right: 4, opacity: 0}}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                            <Divider/>
                            <Box
                                sx={{
                                    bgcolor: open ? "rgba(71, 98, 130, 0.2)" : null,
                                }}
                            >
                                <ListItemButton
                                    alignItems="flex-start"
                                    onClick={() => setOpen(!open)}
                                    sx={{
                                        px: 3,
                                        pt: 2.5,
                                        pb: open ? 0 : 2.5,
                                        "&:hover, &:focus": {
                                            "& svg": {opacity: open ? 1 : 0},
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary="Build"
                                        primaryTypographyProps={{
                                            fontSize: 15,
                                            fontWeight: "medium",
                                            lineHeight: "20px",
                                            mb: "2px",
                                        }}
                                        secondary="Authentication, Firestore Database, Realtime Database, Storage, Hosting, Functions, and Machine Learning"
                                        secondaryTypographyProps={{
                                            noWrap: true,
                                            fontSize: 12,
                                            lineHeight: "16px",
                                            color: open ? "rgba(0,0,0,0)" : "rgba(255,255,255,0.5)",
                                        }}
                                        sx={{my: 0}}
                                    />
                                    <KeyboardArrowDown
                                        sx={{
                                            mr: -1,
                                            opacity: 0,
                                            transform: open ? "rotate(-180deg)" : "rotate(0)",
                                            transition: "0.2s",
                                        }}
                                    />
                                </ListItemButton>
                                {open &&
                                    data.map((item) => (
                                        <ListItemButton
                                            key={item.label}
                                            sx={{
                                                py: 0,
                                                minHeight: 45,
                                                color: "rgba(255,255,255,.8)",
                                            }}
                                        >
                                            <ListItemIcon sx={{color: "inherit"}}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{
                                                    fontSize: 14,
                                                    fontWeight: "medium",
                                                }}
                                            />
                                        </ListItemButton>
                                    ))}
                            </Box>
                        </FireNav>
                        <List
                            sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "background.paper",
                                "& .MuiListItemButton-root": {
                                    paddingLeft: 3,
                                },
                                "& .MuiListItemIcon-root": {
                                    minWidth: '40px'
                                }
                            }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Nested List Items
                                </ListSubheader>
                            }
                            disablePadding
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
                                {openTwo ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                            <Collapse in={openTwo} timeout="auto" unmountOnExit>
                                <List
                                    component="div"
                                    sx={{
                                        paddingLeft: 2
                                    }}
                                    disablePadding
                                >
                                    <ListItemButton>
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
                                padding: 3,
                            }}
                            primary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec semper maximus leo, quis iaculis dui vestibulum non. Proin turpis elit, blandit nec nulla sed, posuere ultricies ipsum. Nunc cursus facilisis mi nec sodales."
                            primaryTypographyProps={{
                                fontSize: 12,
                                fontWeight: "medium",
                                letterSpacing: 0,
                            }}
                        />
                        <Divider/>
                        <ListItemButton component="a" href="#customized-list">
                            <ListItemIcon sx={{fontSize: 20}}>🔥</ListItemIcon>
                            <ListItemText
                                sx={{my: 0}}
                                primary="Firebash"
                                primaryTypographyProps={{
                                    fontSize: 20,
                                    fontWeight: "medium",
                                    letterSpacing: 0,
                                }}
                            />
                        </ListItemButton>
                    </Paper>
                </Box>
                <Box display="flex" sx={{bgcolor: "background.paper"}}>
                    <ListItemButton sx={{height: 40}}>
                        <ListItemIcon>
                            <Home color="primary"/>
                        </ListItemIcon>
                        <ListItemText
                            primary="Footer"
                            primaryTypographyProps={{
                                color: "primary",
                                fontWeight: "medium",
                                variant: "body2",
                            }}
                        />
                    </ListItemButton>
                </Box>
            </ThemeProvider>
        </Drawer>
    );
};

export default SideMenu;
