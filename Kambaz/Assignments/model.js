import mongoose from "mongoose";
import schema from "./schema.js";

// Create the model. Mongoose will manage the 'assignments' collection.
const model = mongoose.model("AssignmentModel", schema);

export default model;
