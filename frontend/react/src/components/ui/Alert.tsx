import {styled} from "@mui/material/styles";
import {Alert} from "@mui/material";
import React from "react";

export const FireAlert = styled(Alert)<{ component?: React.ElementType }>({
    width: "100%",
    margin: "16px 0px",
    "& .MuiAlert-icon": {
        "& .MuiSvgIcon-root": {
            fill: " #d32f2f"
        }
    },
    "& .MuiAlert-message": {
        color: "rgb(95, 33, 32)"
    }
});