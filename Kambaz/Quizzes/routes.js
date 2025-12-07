import * as dao from "./dao.js";

export default function QuizRoutes(app) {
  const findQuizzesForCourse = async (req, res) => {
    try {
      const { cid } = req.params;
      const quizzes = await dao.findQuizzesForCourse(cid);
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const findQuizById = async (req, res) => {
    try {
      const { qid } = req.params;
      const quiz = await dao.findQuizById(qid);
      if (!quiz) {
        res.status(404).send("Quiz not found");
      } else {
        res.json(quiz);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const createQuiz = async (req, res) => {
    try {
      const { cid } = req.params;
      const newQuiz = await dao.createQuiz(cid, req.body);
      res.status(201).json(newQuiz);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const deleteQuiz = async (req, res) => {
    try {
      const { qid } = req.params;
      await dao.deleteQuiz(qid);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const updateQuiz = async (req, res) => {
    try {
      const { qid } = req.params;
      const updatedQuiz = await dao.updateQuiz(qid, req.body);
      if (!updatedQuiz) {
        res.status(404).send("Quiz not found to update");
      } else {
        res.json(updatedQuiz);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:qid", findQuizById);
  app.post("/api/courses/:cid/quizzes", createQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);
  app.put("/api/quizzes/:qid", updateQuiz);
}
