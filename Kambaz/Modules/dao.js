// FIX: Add missing import for uuidv4
import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

// Removed the wrapper function. Exporting constants directly.

export const findModulesForCourse = async (courseId) => {
  const course = await model.findById(courseId);
  // Add a check in case the course isn't found
  if (!course) {
    return [];
  }
  return course.modules;
};

export const createModule = async (courseId, module) => {
  // Create the new module object with a new ID
  const newModule = { ...module, _id: uuidv4() };
  // Use $push to add it to the modules array of the correct course
  const status = await model.updateOne(
    { _id: courseId },
    { $push: { modules: newModule } }
  );

  // Return the newly created module, not the update status
  return newModule;
};

export const deleteModule = async (courseId, moduleId) => {
  // Use $pull to remove the module with the matching _id from the array
  const status = await model.updateOne(
    { _id: courseId },
    { $pull: { modules: { _id: moduleId } } }
  );
  return status;
};

export const updateModule = async (courseId, moduleId, moduleUpdates) => {
  // 1. Find the parent course document
  const course = await model.findById(courseId);
  if (!course) return null;

  // 2. Find the specific subdocument (module) within the array
  const module = course.modules.id(moduleId);
  if (!module) return null;

  // 3. Update the subdocument in memory
  Object.assign(module, moduleUpdates);

  // 4. Save the parent document to persist changes to the database
  await course.save();

  // Return the updated module
  return module;
};
