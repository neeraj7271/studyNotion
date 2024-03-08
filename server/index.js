import express from "express";
import userRoutes from "./routes/User.js";
import profileRoutes from "./routes/Profile.js";
import courseRoutes from "./routes/Course.js";
import paymentRoutes from "./routes/Payments.js";
import { dbConnect } from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { cloudinaryConnect } from "./config/cloudinary.js";
import fileUpload from  "express-fileupload"
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT||4000;

//database connect;
dbConnect();

//midddlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/reach", contactUsRoute);

//default route
app.get("/", (req, res)=> {
    return res.json({
        success: true,
        message: "Your sever is up and running....."
    })
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})