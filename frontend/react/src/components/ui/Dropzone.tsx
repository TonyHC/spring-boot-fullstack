import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface MyDropzoneProps {
    customerId: string;
    onUploadCustomerProfileImage: (customerId: string, formData: FormData, provider: string) => Promise<void>;
    sx?: SxProps<Theme>;
}

export const MyDropzone = ({customerId, onUploadCustomerProfileImage, sx}: MyDropzoneProps) => {
    const onDrop = useCallback((acceptedFiles: File[]): void => {
        const formData: FormData = new FormData();
        formData.append("file", acceptedFiles[0]);
        void onUploadCustomerProfileImage(customerId, formData, "cloudinary");
    }, [customerId, onUploadCustomerProfileImage])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <Box {...getRootProps()} sx={sx}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the picture here...</p> :
                    <p>Drag 'n' drop picture here, or click to select picture</p>
            }
        </Box>
    );
};