import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  completedVideos: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubSection",
    }
  ]

});

export default mongoose.model("courseProgress", courseProgressSchema);
