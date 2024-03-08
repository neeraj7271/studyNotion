// Import the required modules
import { Router } from "express"
const router = Router()

//doubt
import { capturePayment, verifySignature } from "../controllers/Payments.js"
import { auth, isInstructor, isStudent, isAdmin } from "../middlewares/auth.js"
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifySignature)
// router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

export default router