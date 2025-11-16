import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  let { enrollments } = db;

  /**
   * Enrolls a user in a course.
   * @param {string} userId - The ID of the user.
   * @param {string} courseId - The ID of the course.
   */
  function enrollUserInCourse(userId, courseId) {
    // Check if enrollment already exists
    const existingEnrollment = enrollments.find(
      (e) => e.user === userId && e.course === courseId
    );
    if (existingEnrollment) {
      return; // Already enrolled
    }
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    enrollments.push(newEnrollment);
    return newEnrollment;
  }

  /**
   * Unenrolls a user from a course.
   * @param {string} userId - The ID of the user.
   * @param {string} courseId - The ID of the course.
   */
  function unenrollUserFromCourse(userId, courseId) {
    db.enrollments = enrollments.filter(
      (e) => !(e.user === userId && e.course === courseId)
    );
  }

  /**
   * Finds all enrollments for a specific user.
   * @param {string} userId - The ID of the user.
   * @returns {Array} - An array of enrollment objects.
   */
  function findEnrollmentsForUser(userId) {
    return enrollments.filter((e) => e.user === userId);
  }

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
  };
}
