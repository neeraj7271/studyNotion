import { Router } from "express"
const router = Router()
import { contactUsController } from "../controllers/ContactUs"

router.post("/contact", contactUsController)

export default router