import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignments = async (req, res) => {
    const { cid } = req.params;
    const courseAssignments = await dao.findAssignmentsForCourse(cid);
    res.json(courseAssignments);
  };

  const createAssignment = async (req, res) => {
    const { cid } = req.params;
    const newAssignment = await dao.createAssignment(cid, req.body);
    res.json(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    const { aid } = req.params;
    await dao.deleteAssignment(aid);
    res.sendStatus(200);
  };

  const updateAssignment = async (req, res) => {
    const { aid } = req.params;
    // Assuming updateAssignment returns the updated object or status
    const updatedAssignment = await dao.updateAssignment(aid, req.body);

    if (updatedAssignment) {
      res.json(updatedAssignment);
    } else {
      res.sendStatus(404);
    }
  };

  app.put("/api/assignments/:aid", updateAssignment);
  app.post("/api/courses/:cid/assignments", createAssignment);
  app.get("/api/courses/:cid/assignments", findAssignments);
  app.delete("/api/assignments/:aid", deleteAssignment);
}
