const cloudinary = require('cloudinary').v2;
const ApiError = require("../utils/ApiError.js");
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Helper function to extract the public ID from the Cloudinary URL
const extractPublicIdFromUrl = (url) => {
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const [publicId] = publicIdWithExtension.split('.');
    return publicId;
};
// Helper function to determine resource type based on file extension
const getResourceType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (extension === 'pdf') return 'raw'; // Handle PDF as 'raw'
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    return 'raw';
};
const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
        console.log("File uploaded successfully on Cloudinary");
        fs.unlinkSync(localFilePath);
        return response.url;
    } catch (error) {
        console.error("Error while uploading file on Cloudinary", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}


// Helper function to delete a resource from Cloudinary
const deleteFromCloudinary = async (url) => {
    try {
        const publicId = extractPublicIdFromUrl(url);
        const resourceType = getResourceType(url);
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new ApiError(500, "Error while deleting resources from Cloudinary");
    }
};
module.exports = { uploadOnCloudinary, deleteFromCloudinary };
