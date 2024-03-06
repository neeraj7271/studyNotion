import Section from "../models/Section.js";
import SubSection from "../models/SubSection.js";
import { imageUploadToCloudinary } from "../utils/imageUploader.js";
import dotenv from "dotenv";

dotenv.config();

//createSubsection handler

export async function createSubSection(req, res) {
  try {
    //data fetch
    const { title, timeDuration, description, sectionId } = req.body;

    //file fetch
    const videoFile = req.files.videoFile;

    //validation
    if (!title || !timeDuration || !description || !videoFile || !sectionId) {
      return res.status(400).json({
        success: true,
        message: "All Fields are required",
      });
    }

    console.log("uploading to cloudinary")
    //upload video to cloudinary
    const uploadDetails = await imageUploadToCloudinary(
      videoFile,
      process.env.FOLDER_NAME,
    );

    console.log("upload details of subsection video file: ",uploadDetails);

    //create subsection
    const subSectionDetails = await SubSection.create({
      title: title,
      description: description,
      timeDuration: timeDuration,
      videoUrl: uploadDetails.secure_url,
    });

    //update section schema
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    )
      .populate("subSection")
      .exec();

    console.log("updated Section: ", updatedSection);

    res.status(200).json({
      success: true,
      message: "SubSection created Successfully",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Someting went wrong while creating the SubSection",
      error: error.message,
    });
  }
}

//update subsection handler
//NEED TO REVIEWED WHTILE TESTING

export async function updateSubSection(req, res) {
  try {
    //data fetch
    const { sectionId, subSectionId, title, description } = req.body;

    //validation
    if (!subSectionId) {
      return res.status(404).json({
        success: false,
        message: "Subsection Not found",
      });
    }

    //find subsection
    const subSection = await SubSection.findById(subSectionId);

    if (title != undefined) {
      subSection.title = title;
    }

    if (description != undefined) {
      subSection.description = description;
    }

    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await imageUploadToCloudinary(
        video,
        process.env.FOLDER_NAME
      );

      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    //find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    console.log("updated section", updatedSection);

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
}

// Delete subsection

export async function deleteSubSection(req, res) {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(404).json({
        success: false,
        message: "All id required",
      });
    }

    //delete the subsection from the section first
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
      //there is need for new true or not
    );

    //now delete the subsection
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    //find updated section and return it

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
}
