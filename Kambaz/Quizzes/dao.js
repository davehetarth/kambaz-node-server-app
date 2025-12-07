import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findQuizzesForCourse = (courseId) =>
  model.find({ course: courseId });

export const findQuizById = (quizId) => model.findById(quizId);

export const createQuiz = (courseId, quiz) => {
  const _id = quiz._id === "new" || !quiz._id ? uuidv4() : quiz._id;

  return model.create({ ...quiz, _id, course: courseId });
};

export const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });

export const updateQuiz = (quizId, quizUpdates) => {
  return model.findByIdAndUpdate(quizId, { $set: quizUpdates }, { new: true });
};
