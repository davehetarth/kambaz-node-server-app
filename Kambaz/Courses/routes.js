import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = await dao.createCourse(req.body);
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    }
    res.json(newCourse);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.json(status);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.json(status);
  };

  // --- ENROLLMENT FUNCTIONS ---

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;

    // HANDLE THE URL MISMATCH:
    // If 'cid' is undefined, it means we hit the /api/courses/:courseId/enroll route
    // So we map 'courseId' from params to 'cid'
    if (!cid) {
      cid = req.params.courseId;
    }

    if (uid === "current" || !uid) {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.json(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;

    // HANDLE THE URL MISMATCH HERE TOO
    if (!cid) {
      cid = req.params.courseId;
    }

    if (uid === "current" || !uid) {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.json(status);
  };

  // --- REGISTER ROUTES ---

  // 1. Standard Course Routes
  app.get("/api/courses", findAllCourses);
  app.post("/api/users/current/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  // 2. The "Notes" Style Enrollment Routes
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  // 3. The "Frontend" Style Enrollment Routes (CRITICAL FIX)
  // This matches what your client.ts is actually sending!
  app.post("/api/courses/:courseId/enroll", enrollUserInCourse);
  app.delete("/api/courses/:courseId/unenroll", unenrollUserFromCourse);
}
