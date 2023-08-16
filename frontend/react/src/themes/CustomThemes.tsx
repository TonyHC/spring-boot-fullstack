import {createTheme, Theme} from "@mui/material/styles";

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

const styleOverridesFormControl = {
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
};

const styleOverridesPaper = {
    root: {
        backgroundColor: "rgb(5, 30, 52)",
        border: "1px solid #E0E3E7"
    }
};

export const loginTheme: Theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: styleOverridesFormTextField
        },
        MuiButton: {
            styleOverrides: styleOverridesFormButton
        }
    }
});

export const customerItemTheme: Theme = createTheme({
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

export const customerFormTheme: Theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: styleOverridesFormTextField
        },
        MuiButton: {
            styleOverrides: styleOverridesFormButton
        },
        MuiFormControl: {
            styleOverrides: styleOverridesFormControl
        },
        MuiPaper: {
            styleOverrides: styleOverridesPaper
        }
    }
});

export const landingTheme: Theme = createTheme({
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

export const navbarTheme: Theme = createTheme({
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

export const sideMenuTheme: Theme = createTheme({
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

export const dashboardTheme: Theme = createTheme({
    components: {
        MuiTable: {
            styleOverrides: {
                root: {
                    "& .MuiTableHead-root": {
                        "& .MuiTableRow-root": {
                            "& .MuiTableCell-root": {
                                borderBottom: "1px solid rgba(0, 0, 0, 0.87)"
                            }
                        }
                    },
                    "& .MuiTableBody-root": {
                        "& .MuiTableRow-root": {
                            "& .MuiTableCell-root": {
                                borderBottom: "1px solid rgba(0, 0, 0, 0.87)"
                            }
                        }
                    }
                }
            }
        }
    }
});

export const customerDashboardTheme: Theme = createTheme({
    palette: {
        primary: {
            main: '#9fa8da'
        }
    },
    components: {
        MuiPagination: {
            styleOverrides: {
                root: {
                    marginLeft: '24px',
                    "& .MuiPagination-ul": {
                        "& .MuiButtonBase-root": {
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#9fa8da"
                            }
                        },
                        "& .MuiPaginationItem-root": {
                            color: "white",
                        }
                    }
                }
            }
        },
        MuiFormControl: {
            styleOverrides: styleOverridesFormControl
        },
        MuiPaper: {
            styleOverrides: styleOverridesPaper
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    color: 'white'
                }
            }
        }
    }
});

export const resetPasswordTheme: Theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: "24px",
                    "& label.Mui-focused": {
                        color: "#263238"
                    },
                    "& .MuiInput-underline:after": {
                        borderBottomColor: "#263238"
                    },
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#263238"
                        },
                        "&:hover fieldset": {
                            borderColor: "#263238"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#263238"
                        }
                    },
                    "& .MuiInputLabel-root": {
                        color: "#263238"
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "#263238"
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: '#263238',
                    borderColor: '#263238',
                    "&:hover": {
                        borderColor: '#263238',
                        backgroundColor: 'D8D9DA'
                    },
                    "&:disabled": {
                        color: '#263238',
                        borderColor: '#263238'
                    }
                }
            }
        }
    }
});