import Profile from "../models/Profile.js";
import User from "../models/User.js"
import Course from "../models/Course.js";
import { imageUploadToCloudinary } from "../utils/imageUploader.js";
import mongoose from "mongoose";


//update profile
export async function updateProfile(req, res) {
    try {
        const {
          firstName ,
          lastName,
          dateOfBirth = "",
          about = "",
          contact = "",
          gender = "",
        } = req.body
        const id = req.user.id
    
        // Find the profile by id
        const userDetails = await User.findById(id)
        console.log("user Details", userDetails);
        const profile = await Profile.findById(userDetails.additionalDetails)
    
        if(firstName && lastName) {

            const user = await User.findByIdAndUpdate(id, {
              firstName,
              lastName,
            })
            await user.save()
        }
    
        // Update the profile fields
        profile.dateOfBirth = dateOfBirth
        profile.about = about
        profile.contact = contact
        profile.gender = gender
    
        // Save the updated profile
        await profile.save()
    
        // Find the updated user details
        const updatedUserDetails = await User.findById(id)
          .populate("additionalDetails")
          .exec()
    
        return res.json({
          success: true,
          message: "Profile updated successfully",
          updatedUserDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the profile",
            error: error.message
        })
    }
}


//delete Account - how can we schedule the delete request for 5 day later
export async function deleteAccount(req, res) {
    try {
        //id fetch
        const id = req.user.id;

        //validation-if the user exists or not
        const userDetails = await User.findById(id);

        if(!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        //delete profile of the user
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        //TODO-HOMEWORK
        //unenroll user from all enrolled courses

        for (const courseId of userDetails.courses) {
            await Course.findByIdAndUpdate(
              courseId,
              { $pull: { studentsEnroled: id } },
              { new: true }
            )
          }

        //user delete
        await User.findByIdAndDelete({_id: id});


        //return response
        res.status(200).json({
            success: false,
            messgae: "User deleted Successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Some thing went wrong while deleting the profile."
        });
    }
}

export async function updateDisplayPicture (req, res) {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await imageUploadToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }


//get Profile data
export async function getAllUserDetails(req, res) {
    try {

        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        res.status(200).json({
            success: true,
            message: "User data fetched successfully.",
            userDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the details of the user"
        })
    }
}