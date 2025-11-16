import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  /**
   * Enrolls the currently logged-in user in a course.
   */
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

  /**
   * Unenrolls the currently logged-in user from a course.
   */
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

  /**
   * Finds all enrollments for the currently logged-in user.
   */
  const findMyEnrollments = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const enrollments = dao.findEnrollmentsForUser(currentUser._id);
    res.json(enrollments);
  };

  // Define the API routes
  app.post("/api/courses/:courseId/enroll", enrollInCourse);
  app.delete("/api/courses/:courseId/unenroll", unenrollFromCourse);
  app.get("/api/users/current/enrollments", findMyEnrollments);
}
