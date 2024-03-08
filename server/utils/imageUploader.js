import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';


export async function imageUploadToCloudinary(file, folder, height, quality) {
    console.log("inside uploading to cloudinary")
    let options = {folder};
    if(quality) {
        options.quality = quality;
    }
    if(height) {
        options.height = height;
    }

    options.resource_type = "auto";

    return cloudinary.uploader.upload(file.tempFilePath, options);

}