import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  let { assignments } = db;

  const findAssignmentsForCourse = (courseId) =>
    assignments.filter((a) => a.course === courseId);

  const createAssignment = (courseId, assignment) => {
    const newAssignment = {
      ...assignment,
      course: courseId,
      _id: uuidv4(),
    };
    assignments.push(newAssignment);
    return newAssignment;
  };

  const deleteAssignment = (assignmentId) => {
    assignments = assignments.filter((a) => a._id !== assignmentId);
  };

  const updateAssignment = (assignmentId, assignmentUpdates) => {
    const assignmentIndex = assignments.findIndex(
      (a) => a._id === assignmentId
    );
    if (assignmentIndex > -1) {
      assignments[assignmentIndex] = {
        ...assignments[assignmentIndex],
        ...assignmentUpdates,
      };
      return assignments[assignmentIndex];
    }
    return null;
  };
  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
