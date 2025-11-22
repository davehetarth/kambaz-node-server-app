import mongoose from "mongoose";
import moduleSchema from "../Modules/schema.js";
const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    location: String, // <--- CRITICAL: This allows the image path to pass through
    startDate: String,
    endDate: String,
    department: String,
    image: String,
    modules: [moduleSchema],
  },
  { collection: "courses" }
);
export default courseSchema;
