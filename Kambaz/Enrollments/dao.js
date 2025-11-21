import model from "./model.js";

// The DAO now relies entirely on the imported Mongoose model.
export default function EnrollmentsDao() {
  // Find all courses a user is enrolled in. Used by CourseRoutes to filter Dashboard.
  async function findCoursesForUser(userId) {
    // Find enrollments for the user and populate the 'course' field with full course details.
    const enrollments = await model
      .find({ user: userId })
      .populate("course")
      .lean(); // .lean() ensures safe JSON serialization

    // Return only the course objects, not the enrollment wrapper documents
    return enrollments.map((enrollment) => enrollment.course);
  }

  // Find all users enrolled in a specific course. Used by PeopleTable.
  async function findUsersForCourse(courseId) {
    const enrollments = await model
      .find({ course: courseId })
      .populate("user")
      .lean();

    // Return only the user objects
    return enrollments.map((enrollment) => enrollment.user);
  }

  // Enrolls a user in a course. Uses findOneAndUpdate with upsert for atomic operation.
  async function enrollUserInCourse(userId, courseId) {
    const newEnrollment = {
      user: userId,
      course: courseId,
      // Creates a unique, deterministic ID for the document
      _id: `${userId}-${courseId}`,
    };
    const status = await model.findOneAndUpdate(
      { _id: newEnrollment._id },
      newEnrollment,
      { upsert: true, new: true } // Creates document if it doesn't exist
    );
    return status;
  }

  // Unenrolls a user from a course.
  function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  // Deletes all enrollments for a course (used when deleting a course).
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  // Implements the original provided function (renamed for clarity)
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
