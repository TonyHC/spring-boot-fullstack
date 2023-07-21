import {FieldHookConfig, useField} from "formik";
import {TextField} from "@mui/material";
import {FireAlert} from "./Alert.tsx";

type BaseTextFieldProps = FieldHookConfig<string> & {
    id: string,
    label: string,
    type: string,
    placeholder?: string
};

export const CustomTextInput = (props: BaseTextFieldProps) => {
    const [field, meta] = useField(props);

    return (
        <>
            <TextField fullWidth id={props.id} label={props.label} variant="outlined"
                       type={props.type} className="text-input" placeholder={props.placeholder} {...field}
            />
            {meta.touched && meta.error ? (
                <FireAlert className="error" variant="outlined" severity="error" color="error"
                           sx={{width: "100%", mt: -1, mb: 2}}>
                    {meta.error}
                </FireAlert>
            ) : null}
        </>
    );
};