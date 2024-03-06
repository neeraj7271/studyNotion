import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export function dbConnect() {
    mongoose.connect(process.env.MONGODB_URL)
    .then(
        console.log("DB connected Successfully..")
    )
    .catch((error) => {
        console.log("Error Occured While Establishing the connection with database");
        console.error(error);
        process.exit(1);
    })
}