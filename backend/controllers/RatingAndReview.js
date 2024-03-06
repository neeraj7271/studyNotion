import RatingAndReview from "../models/RatingAndReview.js";
import Course from "../models/Course.js";


//need to explored carefully with good understanding
//createRating
export async function createRating(req, res) {
  try {
    //get user id
    const userId = req.user.id;

    //fetch data from req body
    const { rating, review, courseId } = req.body;

    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $eleMatch: { $eq: userId } }, //study both operators
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    //check if user already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }

    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update course with rating and review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    console.log("updated Course Details in rating", updatedCourseDetails);

    //return response
    res.status(200).json({
      success: true,
      message: "Rating and Review Successfully",
      ratingReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Rating and Reviewing the course",
      error: error.message,
    });
  }
}

//getAverageRatings
export async function getAverageRating(req, res) {
  try {

    //get Course id
    const courseId = req.body.courseId;

    //calculate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id:null,
          averageRating: {$avg: "$rating"},
        },
      }
    ])
    //return rating
    if(result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      })
    }


    //if not Raing/Review exists
    return res.status(200).json({
      success: true,
      message: "Average Rating is 0, no rating given till now",
      averageRating: 0,
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while finding the average rating",
      error: error.message,
    });
  }
}

//getAllRating
export async function getAllRating(req, res) {
  try {
    const allReviews = await RatingAndReview.find({})
                            .sort({rating: "desc"})
                            .populate({
                              path: "user",
                              select: "firstName lastName email, image",
                            })
                            .populate({
                              path: "course",
                              select: "courseName",
                            })
                            .exec();

      return res.status(200).json({
        success: true,
        message: "All reviews fetched successfully",
        data: allReviews,
      })
  } catch (error) {
    confirm.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all Reviews and Rating.",
      error: error.message,
    })
  }
}
