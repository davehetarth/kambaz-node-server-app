import mongoose from "mongoose";

// Define what an assignment looks like in the database
const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    course: { type: String, required: true },
    description: { type: String },
    points: { type: Number, default: 100 },
    due: { type: Date },
    availablefrom: { type: Date },
    availableto: { type: Date },
  },
  { collection: "assignments" }
); // Explicitly naming the collection in MongoDB

export default assignmentSchema;
