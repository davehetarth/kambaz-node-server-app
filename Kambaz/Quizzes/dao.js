import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// Find all quizzes belonging to a specific course
export const findQuizzesForCourse = (courseId) =>
  model.find({ course: courseId });

// Find a single quiz by its ID
export const findQuizById = (quizId) => model.findById(quizId);

// Create a new quiz document
export const createQuiz = (courseId, quiz) => {
  // If the incoming quiz has the ID "new" or no ID, generate a real UUID
  const _id = quiz._id === "new" || !quiz._id ? uuidv4() : quiz._id;
  // Create it, ensuring the course link is set
  return model.create({ ...quiz, _id, course: courseId });
};

// Delete a quiz document
export const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });

// Update an existing quiz
export const updateQuiz = (quizId, quizUpdates) => {
  // { new: true } ensures the function returns the updated document
  return model.findByIdAndUpdate(quizId, { $set: quizUpdates }, { new: true });
};
