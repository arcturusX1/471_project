// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

import path from "path";
import { fileURLToPath } from "url";
import { mockAuth, requireRole } from "./middleware/mockAuth.js";
import authRoutes from "./routes/authRoutes.js";
import consultationRoutes from './routes/consultationRoutes.js';
import projectRoutes from "./routes/projects.js";
import evaluationRoutes from "./routes/evaluations.js";
import bookingRoutes from "./routes/bookings.js";
import positionRoutes from "./routes/positions.js";

// Import yasir branch routes  
import locationRoutes from "./routes/locationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupPostRoutes from "./routes/groupPostRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";

import Application from "./models/Application.js";

// Applications routes (inline for now)
const applicationRoutesInline = express.Router();

// Mock positions data to derive positionType from positionId
const mockPositions = [
    { id: '1', type: 'TA' },
    { id: '2', type: 'RA' },
    { id: '3', type: 'ST' }
];

// Apply for position (only students)
applicationRoutesInline.post('/', mockAuth, requireRole('student'), async (req, res) => {
    try {
        const { positionId, studentName, email, studentId, gpa, expertise, availability, experience, coverLetter } = req.body;

        // Derive positionType from positionId using mock positions data
        const position = mockPositions.find(p => p.id === positionId);
        if (!position) {
            return res.status(400).json({ message: 'Invalid position ID' });
        }

        const application = new Application({
            student: req.user?.id || 'demo-student-1',
            positionId,
            positionType: position.type,
            studentName,
            email,
            studentId,
            gpa,
            expertise,
            availability,
            experience,
            coverLetter,
            status: 'pending', // standardized lowercase
            appliedAt: new Date()
        });

        await application.save();
        console.log('Application saved to DB:', application._id);
        res.status(201).json(application);
    } catch (error) {
        console.error('Application create error:', error);
        res.status(500).json({ message: 'Server error', error: error.message, details: error.errors });
    }
});

// Get applications
applicationRoutesInline.get('/', mockAuth, async (req, res) => {
    try {
        let applications;
        if (req.user?.role === 'admin' || req.user?.role === 'faculty') {
            applications = await Application.find().sort({ appliedAt: -1 });
        } else {
            applications = await Application.find({ student: (req.user?.id || 'demo-student-1') }).sort({ appliedAt: -1 });
        }
        res.json(applications);
    } catch (error) {
        console.error('Fetch applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update application status
applicationRoutesInline.patch('/:id', mockAuth, requireRole('admin', 'faculty'), async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            {
                status: status.toLowerCase(), // ensure lowercase
                reviewedBy: req.user?.id || 'demo-admin-1',
                reviewedAt: new Date()
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

console.log('Application routes created successfully');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env (ensures correct MONGODB_URI in this folder)
dotenv.config({ path: path.join(__dirname, '.env') });

// Set sensible defaults for dev if env not provided
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-management';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
process.env.PORT = process.env.PORT || '5000';

const app = express();

// Configure CORS properly
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'], // Add your client URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role']
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Campus Management System Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Main branch routes
app.use('/api/auth', authRoutes);
console.log('Registering applications route');
app.use('/api/applications', applicationRoutesInline);
console.log('Applications route registered');
app.use("/api/projects", projectRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/positions', positionRoutes);

// Yasir branch routes
app.use("/api/locations", locationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/group-posts", groupPostRoutes);
app.use("/api/faculty", facultyRoutes);

const startServer = async () => {
    try {
        // Try connectDB first, fallback to direct mongoose connection
        try {
            await connectDB();
        } catch (err) {
            console.log('connectDB failed, trying direct mongoose connection');
            const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://db_connect:9wnOGOZ4RVGtCttH@cluster0.puwqhsb.mongodb.net/?appName=Cluster0";
            await mongoose.connect(MONGO_URI);
        }
        console.log("Connected to MongoDB");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

startServer();

// Ensure consultations route is available
app.use('/api/consultations', consultationRoutes);

app.get("/", (req, res) => {
    res.send("APCMS backend running...");
});
