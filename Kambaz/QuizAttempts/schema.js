import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: { type: String, ref: "QuizModel", required: true, index: true },
    user: { type: String, ref: "UserModel", required: true, index: true },

    answers: {
      type: Map,
      of: String,
      required: true,
    },

    score: { type: Number, required: true },

    maxPoints: { type: Number, required: true },

    attemptDate: { type: Date, default: Date.now },
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
