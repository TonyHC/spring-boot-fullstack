import {styled} from "@mui/material/styles";
import {Paper} from "@mui/material";
import React from "react";

export const GridPaper = styled(Paper)<{ component?: React.ElementType }>({
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#e1ebff'
});