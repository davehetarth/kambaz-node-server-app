import model from "./model.js";

// Create a new attempt record
export const createAttempt = (attemptData) => model.create(attemptData);

// Find all attempts a specific user made for a specific quiz
export const findAttemptsForUser = (quizId, userId) =>
  model.find({ quiz: quizId, user: userId }).sort({ attemptDate: -1 });

// --- ADD THIS NEW FUNCTION ---
// Find a specific attempt by its unique ID
export const findAttemptById = (attemptId) => model.findById(attemptId);
// -----------------------------

// Find the best score a user has for a quiz
export const findBestAttempt = async (quizId, userId) => {
  const attempts = await model
    .find({ quiz: quizId, user: userId })
    .sort({ score: -1 })
    .limit(1);
  return attempts[0];
};
