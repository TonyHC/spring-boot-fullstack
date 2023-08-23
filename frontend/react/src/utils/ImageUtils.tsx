export const buildCloudinaryImagePath = (imageDomainPath: string): string => {
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_USERNAME}/image/upload${imageDomainPath}`;
}