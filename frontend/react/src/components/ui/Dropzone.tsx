import React, {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface MyDropzoneProps {
    customerId: string;
    onUploadCustomerProfileImage: (customerId: string, formData: FormData, provider: string) => void;
    setValue?: React.Dispatch<React.SetStateAction<number>>;
    sx?: SxProps<Theme>;
}

export const MyDropzone = ({customerId, onUploadCustomerProfileImage, setValue, sx}: MyDropzoneProps) => {
    const onDrop = useCallback((acceptedFiles: File[]): void => {
        const formData: FormData = new FormData();
        formData.append("file", acceptedFiles[0]);
        void onUploadCustomerProfileImage(customerId, formData, "cloudinary");

        if (setValue) {
            setValue(0);
        }
    }, [customerId, onUploadCustomerProfileImage, setValue]);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <Box {...getRootProps()} sx={sx}>
            <input data-testid="dropzone" {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the picture here...</p> :
                    <p>Drag 'n' drop picture here, or click to select picture</p>
            }
        </Box>
    );
};