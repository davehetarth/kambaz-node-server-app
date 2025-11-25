import model from "./model.js";

// NOTE: We removed the "export default function AssignmentsDao() {...}" wrapper.
// We are now exporting each function directly using "export const".

export const findAssignmentsForCourse = (courseId) => {
  console.log("DAO: Inside findAssignmentsForCourse");
  console.log(`DAO: Querying model for course: ${courseId}`);

  // FIX #1: Added the critical 'return' keyword here!
  return model.find({ course: courseId });
};

export const createAssignment = (courseId, assignment) => {
  // FIX #1: Added 'return' (though arrow functions without braces do it implicitly, being explicit is safer)
  return model.create({ ...assignment, course: courseId });
};

export const deleteAssignment = (assignmentId) => {
  // FIX #1: Added 'return'
  return model.deleteOne({ _id: assignmentId });
};

export const updateAssignment = (assignmentId, assignmentUpdates) => {
  // FIX #1: Added 'return'
  return model.findByIdAndUpdate(
    assignmentId,
    { $set: assignmentUpdates },
    { new: true }
  );
};
