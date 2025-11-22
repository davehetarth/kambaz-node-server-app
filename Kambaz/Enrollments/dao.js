import model from "./model.js";

export default function EnrollmentsDao() {
  async function findCoursesForUser(userId) {
    console.log("DAO: Finding courses for user:", userId);

    // 1. Find enrollments
    const enrollments = await model
      .find({ user: userId })
      .populate("course")
      .lean();

    console.log("DAO: Found raw enrollments:", enrollments.length);

    // 2. Extract courses and filter out nulls
    const courses = enrollments.map((e) => e.course).filter((c) => c !== null);

    console.log("DAO: Returning valid courses:", courses.length);
    return courses;
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model
      .find({ course: courseId })
      .populate("user")
      .lean();
    return enrollments.map((e) => e.user).filter((u) => u);
  }

  async function enrollUserInCourse(userId, courseId) {
    const newEnrollment = {
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    };
    const status = await model.findOneAndUpdate(
      { _id: newEnrollment._id },
      newEnrollment,
      { upsert: true, new: true }
    );
    return status;
  }

  function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  function findEnrollmentsByUserId(userId) {
    return model.find({ user: userId }).lean();
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    findEnrollmentsByUserId,
  };
}
