import EnrollmentsDao from "./dao.js";

console.log("Enrollment Routes: FILE LOADED");

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const findMyEnrollments = async (req, res) => {
    console.log("Enrollment Routes: findMyEnrollments called");
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      console.log("Enrollment Routes: No User in Session");
      res.sendStatus(401);
      return;
    }
    const enrollments = await dao.findCoursesForUser(currentUser._id);
    res.json(enrollments);
  };

  const enrollInCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const newEnrollment = await dao.enrollUserInCourse(
      currentUser._id,
      courseId
    );
    res.json(newEnrollment);
  };

  const unenrollFromCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    await dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.sendStatus(200);
  };

  app.post("/api/courses/:courseId/enroll", enrollInCourse);
  app.delete("/api/courses/:courseId/unenroll", unenrollFromCourse);
  app.get("/api/users/current/enrollments", findMyEnrollments);
}
