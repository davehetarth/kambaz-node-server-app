import * as attemptDao from "./dao.js";

import * as quizDao from "../Quizzes/dao.js";

export default function QuizAttemptRoutes(app) {
  const submitQuiz = async (req, res) => {
    try {
      const { qid: quizId } = req.params;

      const { userId, answers } = req.body;

      console.log(`Server Grading: Quiz ${quizId} for User ${userId}`);

      const quiz = await quizDao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).send("Quiz not found for grading");
      }

      let totalScore = 0;
      let maxPoints = 0;

      quiz.questions.forEach((question) => {
        maxPoints += question.points;
        const studentAnswer = answers[question._id];

        if (!studentAnswer) return;

        let isCorrect = false;

        switch (question.questionType) {
          case "TRUE_FALSE":
          case "FILL_BLANKS":
            isCorrect = studentAnswer === question.correctAnswer;
            break;

          case "MULTIPLE_CHOICE":
            const selectedChoice = question.choices.find(
              (c) => c._id.toString() === studentAnswer
            );
            if (selectedChoice && selectedChoice.isCorrect) {
              isCorrect = true;
            }
            break;
        }

        if (isCorrect) {
          totalScore += question.points;
        }
      });

      console.log(`Grading Complete. Score: ${totalScore}/${maxPoints}`);

      const attemptData = {
        quiz: quizId,
        user: userId,
        answers: answers,
        score: totalScore,
        maxPoints: maxPoints,
      };

      const newAttempt = await attemptDao.createAttempt(attemptData);

      res.status(201).json(newAttempt);
    } catch (err) {
      console.error("Error during grading:", err);
      res.status(500).json({ error: err.message });
    }
  };

  const findUserAttempts = async (req, res) => {
    try {
      const { qid, uid } = req.params;
      const attempts = await attemptDao.findAttemptsForUser(qid, uid);
      res.json(attempts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const findAttemptById = async (req, res) => {
    try {
      const { aid } = req.params;
      const attempt = await attemptDao.findAttemptById(aid);
      if (!attempt) {
        res.status(404).send("Attempt not found");
      } else {
        res.json(attempt);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  app.post("/api/quizzes/:qid/attempts", submitQuiz);
  app.get("/api/quizzes/:qid/users/:uid/attempts", findUserAttempts);
  app.get("/api/quizzes/attempts/:aid", findAttemptById);
}
