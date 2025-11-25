import * as modulesDao from "./dao.js";

export default function ModulesRoutes(app) {
  // No 'db' needed anymore

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    // FIX: Use the correctly imported modulesDao object
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    // FIX: Use modulesDao
    const newModule = await modulesDao.createModule(courseId, req.body);
    res.json(newModule);
  };

  const deleteModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    // FIX: Use modulesDao
    const status = await modulesDao.deleteModule(courseId, moduleId);
    res.json(status);
  };

  const updateModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const moduleUpdates = req.body;
    // FIX: Use modulesDao
    const status = await modulesDao.updateModule(
      courseId,
      moduleId,
      moduleUpdates
    );
    res.json(status);
  };

  // Using 'cid' and 'mid' to match your other routes is better practice,
  // but 'courseId' and 'moduleId' work as long as they match the destructuring above.
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
}
