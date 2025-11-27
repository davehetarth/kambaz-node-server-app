import * as attemptDao from "./dao.js";
// We need the quiz DAO to fetch the correct answers for grading
import * as quizDao from "../Quizzes/dao.js";

export default function QuizAttemptRoutes(app) {
  // POST - Submit a quiz for grading
  const submitQuiz = async (req, res) => {
    try {
      const { qid: quizId } = req.params;
      // Assuming the current user's ID is passed in body or session.
      // For now, let's assume it's in the body along with answers.
      const { userId, answers } = req.body;

      console.log(`Server Grading: Quiz ${quizId} for User ${userId}`);

      // 1. Fetch the actual quiz document with correct answers hidden in DB
      const quiz = await quizDao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).send("Quiz not found for grading");
      }

      let totalScore = 0;
      let maxPoints = 0;

      // 2. Iterate through questions and grade them
      quiz.questions.forEach((question) => {
        maxPoints += question.points;
        const studentAnswer = answers[question._id];

        // If student didn't answer, skip
        if (!studentAnswer) return;

        let isCorrect = false;

        switch (question.questionType) {
          case "TRUE_FALSE":
          case "FILL_BLANKS":
            // Simple string comparison. (Case-insensitive for blanks might be nicer later, but exact match for now)
            isCorrect = studentAnswer === question.correctAnswer;
            break;

          case "MULTIPLE_CHOICE":
            // studentAnswer is the ID of the selected choice. Find that choice object.
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

      // 3. Create the attempt record
      const attemptData = {
        quiz: quizId,
        user: userId,
        answers: answers, // Save their submitted answers
        score: totalScore,
        maxPoints: maxPoints,
      };

      const newAttempt = await attemptDao.createAttempt(attemptData);
      // Return the graded attempt to the frontend
      res.status(201).json(newAttempt);
    } catch (err) {
      console.error("Error during grading:", err);
      res.status(500).json({ error: err.message });
    }
  };

  // GET - Find past attempts for the current user
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
