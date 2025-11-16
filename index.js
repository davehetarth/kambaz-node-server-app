import express from "express";
import "dotenv/config";
import session from "express-session";
import cors from "cors";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import PathParameters from "./Lab5/PathParameters.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import QueryParameters from "./Lab5/QueryParameters.js";
import WorkingWithObjects from "./Lab5/WorkingWithObjects.js";
import WorkingWithArrays from "./Lab5/WorkingWithArrays.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();

// 1. CORS: Allow your Vercel app
app.use(
  cors({
    credentials: true,
    // Ensure CLIENT_URL is set in Render env vars, or fallback to localhost
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    // 2. REMOVED the 'domain' property to avoid configuration errors
  };
}
app.use(session(sessionOptions));

app.use(express.json());

// 3. Register all routes
UserRoutes(app, db);
CourseRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
ModulesRoutes(app, db);
Hello(app);
Lab5(app);
PathParameters(app);
QueryParameters(app);
WorkingWithObjects(app);
WorkingWithArrays(app);

app.listen(process.env.PORT || 4000);
