import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  const findAssignments = async (req, res) => {
    console.log("--> RECEIVED REQUEST: findAssignments (GET)"); // LOG 1
    try {
      const { cid } = req.params;
      // await the database response
      console.log(`--> Looking for assignments for course: ${cid}`); // LOG 2
      const courseAssignments = await dao.findAssignmentsForCourse(cid);
      console.log(
        `--> SUCCESS: Found ${courseAssignments.length} assignments.`
      ); // LOG 3
      res.json(courseAssignments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const createAssignment = async (req, res) => {
    try {
      const { cid } = req.params;

      const newAssignment = await dao.createAssignment(cid, req.body);
      res.json(newAssignment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const deleteAssignment = async (req, res) => {
    try {
      const { aid } = req.params;
      // await the deletion
      await dao.deleteAssignment(aid);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const updateAssignment = async (req, res) => {
    try {
      const { aid } = req.params;
      // await the update
      const updatedAssignment = await dao.updateAssignment(aid, req.body);
      if (updatedAssignment) {
        res.json(updatedAssignment);
      } else {
        // If findByIdAndUpdate returns null, the ID wasn't found
        res.sendStatus(404);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  app.put("/api/assignments/:aid", updateAssignment);
  app.post("/api/courses/:cid/assignments", createAssignment);
  app.get("/api/courses/:cid/assignments", findAssignments);
  app.delete("/api/assignments/:aid", deleteAssignment);
}
