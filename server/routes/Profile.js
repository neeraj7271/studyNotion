import { Router } from "express"
const router = Router()
import { auth, isInstructor } from "../middlewares/auth.js"
import { deleteAccount, updateProfile, getAllUserDetails, updateDisplayPicture } from "../controllers/Profile.js"

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
// router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

export default router