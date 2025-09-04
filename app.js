import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import doctorRoutes from "./routes/doctors.route.js";
import patientRoutes from "./routes/patients.route.js";
import mappingRoutes from "./routes/mappings.route.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/mappings", mappingRoutes);


app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
});