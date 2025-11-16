import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const enrollInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const newEnrollment = dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(newEnrollment);
  };

  const unenrollFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.sendStatus(200);
  };

  const findMyEnrollments = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const enrollments = dao.findEnrollmentsForUser(currentUser._id);
    res.json(enrollments);
  };

  app.post("/api/courses/:courseId/enroll", enrollInCourse);
  app.delete("/api/courses/:courseId/unenroll", unenrollFromCourse);
  app.get("/api/users/current/enrollments", findMyEnrollments);
}
