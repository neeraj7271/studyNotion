import User from "../models/User.js";
import Category from "../models/Category.js";
import Course from "../models/Course.js";
import { imageUploadToCloudinary } from "../utils/imageUploader.js";
import dotenv from "dotenv";

dotenv.config();

//create course handler
export async function createCourse(req, res) {
  try {
    // console.log("inside create course");
    //data fetch
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status
    } = req.body;

    const thumbnail = req.files.thumbnail;

    const userId = req.user.id;
    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category ||
      !thumbnail
    ) {
      return res.status(401).json({
        success: false,
        message: "All fields are required..",
      });
    }
    console.log(courseName);
    console.log(courseDescription);
    console.log(whatYouWillLearn);
    console.log(price);
    console.log(tag);
    console.log(category);
    console.log(status);

    if(!status || status === undefined) {
      status = "Draft";
    }
    

    //fetching the instructor
    const instructorDetails = await User.findOne(
      { _id: userId },
      {
        accountType: "Instructor",
      }
    );

    console.log("instructor details printing ", instructorDetails);

    if (!instructorDetails) {
      return res.status(403).json({
        success: false,
        message: "instructor not found",
      });
    }

    // console.log("before tagedetails");

    //tag validation
    const categoryDetails = await Category.findById(category);

    console.log("printing category details: ", categoryDetails);

    if (!categoryDetails) {
      return res.status(402).json({
        success: false,
        message: "No TagDetail found",
      });
    }

    //image upload
    const thumbnailImage = await imageUploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    if(!status || status === undefined) {
      status = "Draft";
    }

    //create entry in db
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      tag,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      thumbnail: thumbnailImage.secure_url,
      category: categoryDetails._id,
      status: status,
    });

    //update course entry in user schema
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    )

    console.log("printing the category details2: ", categoryDetails2);

    res.status(200).json({
      success: true,
      message: "Course created successfully..",
      newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating the course, Plese try again.",
    });
  }
}

//getAllCourses handler
export async function getAllCourses(req, res) {
  try {
    const allCourses = await Course.find({});

    if (!allCourses) {
      return res.status(402).json({
        success: false,
        message: "no course found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Found all courses detail successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the course data",
    });
  }
}

export async function getCourseDetails(req, res) {
  try {
    //getch courseId
    const { courseId } = req.body;

    //find course detail
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //validaion
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    //return response
    res.status(200).json({
      success: true,
      message: "Course Details fetched Successfully",
      courseDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the course details",
      error: error.message,
    });
  }
}
