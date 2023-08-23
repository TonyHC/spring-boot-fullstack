import {useField} from "formik";
import {FormControl, InputLabel, Select} from "@mui/material";
import {FireAlert} from "./Alert.tsx";
import {BaseSelectProps} from "../../types.ts";

export const CustomSelect = ({label, children, ...props}: BaseSelectProps) => {
    const [field, meta] = useField(props);

    return (
        <>
            <FormControl fullWidth>
                <InputLabel id={props.labelId}>{label}</InputLabel>
                <Select
                    id={props.id}
                    labelId={props.labelId}
                    label={label}
                    defaultValue=""
                    {...field}
                >
                    {children}
                </Select>
            </FormControl>
            {meta.touched && meta.error ? (
                <FireAlert className="error" variant="outlined" severity="error" color="error"
                           sx={{width: "100%", mt: -1, mb: 2}}>
                    {meta.error}
                </FireAlert>
            ) : null}
        </>
    );
};