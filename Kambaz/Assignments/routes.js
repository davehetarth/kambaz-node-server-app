import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignments = (req, res) => {
    const { cid } = req.params;
    const courseAssignments = dao.findAssignmentsForCourse(cid);
    res.json(courseAssignments);
  };

  const createAssignment = (req, res) => {
    const { cid } = req.params;
    const newAssignment = dao.createAssignment(cid, req.body);
    res.json(newAssignment);
  };

  const deleteAssignment = (req, res) => {
    const { aid } = req.params;
    dao.deleteAssignment(aid);
    res.sendStatus(200);
  };

  const updateAssignment = (req, res) => {
    const { aid } = req.params;
    const updatedAssignment = dao.updateAssignment(aid, req.body);
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
