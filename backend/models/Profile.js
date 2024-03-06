import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  gender: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
	},
	contact: {
		type: Number,
		trim: true,
	},
});

export default mongoose.model("Profile", profileSchema);
