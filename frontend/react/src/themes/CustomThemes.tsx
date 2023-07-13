import {createTheme} from "@mui/material/styles";

const styleOverridesFormButton = {
    root: {
        "& .Mui-disabled": {
            color: "#A0AAB4"
        },
        "&:hover": {
            backgroundColor: "#6F7E8C",
            boxShadow: "none"
        },
        "&:disabled": {
            color: 'inherit',
            borderColor: 'inherit'
        }
    }
};

const styleOverridesFormTextField = {
    root: {
        marginBottom: "24px",
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
    }
};

export const loginTheme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: styleOverridesFormTextField
        },
        MuiButton: {
            styleOverrides: styleOverridesFormButton
        }
    }
});

export const customerItemTheme = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                root: {
                    "& .MuiDialog-paper": {
                        backgroundColor: "#051e34"
                    },
                    "& .MuiDialogTitle-root": {
                        color: "#E0E3E7"
                    },
                    "& .MuiDialogContentText-root": {
                        color: "#B2BAC2"
                    }
                }
            }
        }
    }
});

export const customerFormTheme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: styleOverridesFormTextField
        },
        MuiButton: {
            styleOverrides: styleOverridesFormButton
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginBottom: "24px",
                    "& .MuiInputLabel-root": {
                        color: "inherit"
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "inherit"
                    },
                    "& .MuiInputBase-root": {
                        color: "inherit",
                        "& fieldset": {
                            borderColor: "#E0E3E7"
                        },
                        "&:hover fieldset": {
                            borderColor: "#B2BAC2"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#6F7E8C"
                        }
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgb(5, 30, 52)",
                    border: "1px solid #E0E3E7"
                }
            }
        }
    }
});

export const landingTheme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: "monospace",
                    fontWeight: 700,
                    "&:hover": {
                        backgroundColor: "#90a4ae",
                        boxShadow: "none"
                    }
                }
            }
        }
    }
});

export const signUpTheme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: styleOverridesFormTextField
        }
    }
});

export const navbarTheme = createTheme({
    palette: {
        background: {
            paper: "rgb(5, 30, 52)"
        }
    },
    components: {
        MuiList: {
            styleOverrides: {
                root: {
                    paddingTop: 0,
                    paddingBottom: 0,
                    "& .MuiDivider-root": {
                        marginTop: 2.5,
                        marginBottom: 2.5
                    },
                    "& .MuiMenuItem-root": {
                        "&:hover": {
                            backgroundColor: "#90a4ae",
                            boxShadow: "none"
                        }
                    }
                }
            }
        },
    }
});

export const sideMenuTheme = createTheme({
    components: {
        MuiListItemButton: {
            defaultProps: {
                disableTouchRipple: false
            }
        }
    },
    palette: {
        mode: "dark",
        primary: {main: "rgb(102, 157, 246)"},
        background: {paper: "rgb(5, 30, 52)"}
    }
});