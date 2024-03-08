import Category from "../models/Category.js";
import Tags from "../models/Category.js";

//creation
export async function createCategory(req, res) {
  try {
    //fectch data
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(401).json({
        success: false,
        message: "All field required",
      });
    }

    //create entry in db
    const tagDetail = await Tags.create({
      name: name,
      description: description,
    });
    console.log("Category Details: ", tagDetail);

    res.status(200).json({
      success: false,
      message: "Category created Successfully",
      data: tagDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong, category cannot be created",
    });
  }
}

//fecth all category
export async function showAllCategories(req, res) {
  try {
    //get all tags from db
    const allCategory = await Tags.find({}, { name: true, description: true });

    if (!allCategory) {
      return res.status(400).json({
        success: false,
        message: "Tags not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Got all categories successfully..",
      allCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the categories",
    });
  }
}

//categoryPageDetails

export async function categoryPageDetails(req, res) {
  try {
    const { categoryId } = req.body;

    //get courses for the specified course category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    //the case when the category not found
    if (!selectedCategory) {
      console.log("Category not  found");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    //the case when there are no courses
    if (selectedCategory.course.length === 0) {
      console.log("No courses found fo rthe selected category");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    //get the course for the other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    //get top selling courses
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    // console.log("mostSellingCourses COURSE", mostSellingCourses)
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the category page details",
      error: error.message,
    });
  }
}
