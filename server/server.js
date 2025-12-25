import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";
import projectRoutes from "./routes/projects.js";
import bookingRoutes from "./routes/bookings.js";
import positionRoutes from "./routes/positions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/positions', positionRoutes);

const startServer = async()=>{
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
