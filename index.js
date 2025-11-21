import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import session from "express-session";
import cors from "cors";

// Import all routes
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

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const isDevelopment = process.env.NODE_ENV === "development";

// --- CORS Configuration (Fixes 405/OPTIONS) ---
// We explicitly allow methods and headers to satisfy pre-flight checks.
app.use(
  cors({
    credentials: true,
    origin: CLIENT_URL,
    // FIX: Explicitly allow OPTIONS, POST, etc., to resolve 405 error
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.set("trust proxy", 1);

// --- Session Configuration (Fixes 401) ---
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  proxy: !isDevelopment,
  cookie: {
    secure: !isDevelopment,
    sameSite: !isDevelopment ? "none" : "lax",
  },
};
app.use(session(sessionOptions));

app.use(express.json());

// 3. Register all routes
// Note: Ensure UserRoutes and CourseRoutes are correctly imported and initialized
UserRoutes(app);
CourseRoutes(app);
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
