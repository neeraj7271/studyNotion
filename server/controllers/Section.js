import Section from "../models/Section.js";
import Course from "../models/Course.js";
import SubSection from "../models/SubSection.js"

//creting the createSection handler
export async function createSection(req, res) {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;

    //validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name required",
      });
    }

    //create section
    const newSection = await Section.create({
      sectionName,
    });

    //updathe course schema with section created
    const updatedCourseDetail = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section created Successfully.",
      updatedCourseDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, Section can not be created",
      error: error.message,
    });
  }
}

//update section handler
export async function updateSection(req, res) {
  try {
    //data fetch
    const { sectionName, sectionId } = req.body;

    //validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    //update the section
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Section Updated Successfully.",
        data: section,
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, Section can not be updated",
      error: error.message,
    });
  }
}


//delete Section handler
export async function deleteSection(req, res) {
    try {
        const {sectionId} = req.params;

        //delete the section
        await Section.findByIdAndDelete(sectionId);

        //TODO[testing]: do we need to delete the entry for the section from the course schema
        
        //return response
        res.status(200).json({
            success: true,
            message: "Section Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, Section can not be deleted",
            error: error.message,
          });
    }
}