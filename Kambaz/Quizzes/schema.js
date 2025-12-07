import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  points: { type: Number, default: 1 },
  questionType: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANKS"],
    required: true,
  },
  description: { type: String, default: "" },

  choices: [
    {
      _id: { type: String, required: true },
      text: String,
      isCorrect: Boolean,
    },
  ],

  correctAnswer: String,
});

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    course: { type: String, required: true, index: true },
    description: { type: String },
    points: { type: Number, default: 0 },
    due: { type: Date },
    availableFromDate: { type: Date },
    availableUntilDate: { type: Date },
    published: { type: Boolean, default: false },
    questions: [questionSchema],

    quizType: {
      type: String,
      enum: [
        "GRADED_QUIZ",
        "PRACTICE_QUIZ",
        "GRADED_SURVEY",
        "UNGRADED_SURVEY",
      ],
      default: "GRADED_QUIZ",
    },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: Boolean, default: true },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
  },
  { collection: "quizzes" }
);

export default quizSchema;
