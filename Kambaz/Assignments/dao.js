import model from "./model.js";

export const findAssignmentsForCourse = (courseId) => {
  console.log("DAO: Inside findAssignmentsForCourse");
  console.log(`DAO: Querying model for course: ${courseId}`);

  return model.find({ course: courseId });
};

export const createAssignment = (courseId, assignment) => {
  return model.create({ ...assignment, course: courseId });
};

export const deleteAssignment = (assignmentId) => {
  return model.deleteOne({ _id: assignmentId });
};

export const updateAssignment = (assignmentId, assignmentUpdates) => {
  return model.findByIdAndUpdate(
    assignmentId,
    { $set: assignmentUpdates },
    { new: true }
  );
};
