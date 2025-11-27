import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    // Link to the Quiz and the User who took it
    quiz: { type: String, ref: "QuizModel", required: true, index: true },
    user: { type: String, ref: "UserModel", required: true, index: true },

    // Store their answers. A map of Question ID -> Answer String
    // Mongoose "Map" type is perfect for the object we built on the frontend.
    answers: {
      type: Map,
      of: String, // The value is the answer string (or choice ID for MC)
      required: true,
    },

    // The calculated final score
    score: { type: Number, required: true },
    // Max possible score at the time of taking (optional but useful)
    maxPoints: { type: Number, required: true },

    // When they finished
    attemptDate: { type: Date, default: Date.now },
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
