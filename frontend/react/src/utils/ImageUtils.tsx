export const buildCloudinaryImagePath = (imageDomainPath: string): string => {
    return 'https://res.cloudinary.com/tonyhchao/image/upload' + imageDomainPath;
}