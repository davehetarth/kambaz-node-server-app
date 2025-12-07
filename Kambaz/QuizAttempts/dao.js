import model from "./model.js";

export const createAttempt = (attemptData) => model.create(attemptData);

export const findAttemptsForUser = (quizId, userId) =>
  model.find({ quiz: quizId, user: userId }).sort({ attemptDate: -1 });

export const findAttemptById = (attemptId) => model.findById(attemptId);

export const findBestAttempt = async (quizId, userId) => {
  const attempts = await model
    .find({ quiz: quizId, user: userId })
    .sort({ score: -1 })
    .limit(1);
  return attempts[0];
};
