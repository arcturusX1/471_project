import express from 'express';
import { User } from '../models/model.js';

const router = express.Router();

// STUDENT/FACULTY LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`🔍 Login Attempt: ${email}`);

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
             console.log("❌ Email not found.");
             return res.status(400).json({ message: "Invalid credentials" });
        }

        const dbPassword = user.passwordHash || user.password;
        if (dbPassword !== password) {
            console.log("❌ Password mismatch.");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("🚀 Login Successful");

        res.json({
            token: "user-token-999",
            user: {
                id: user._id,
                name: user.name,
                roles: user.roles,
                email: user.email,
                universityId: user.universityId,
                profile: user.profile
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ADMIN LOGIN ROUTE
router.post('/admin-login', async (req, res) => {
    try {
        const { universityId, password } = req.body;
        console.log(`🔍 Admin Login Attempt: ${universityId}`);

        const user = await User.findOne({ universityId });
        
        if (!user) {
             console.log("❌ Admin ID not found.");
             return res.status(400).json({ message: "Invalid credentials" });
        }

        const dbPassword = user.passwordHash || user.password;
        if (dbPassword !== password) {
            console.log("❌ Admin Password mismatch.");
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Strictly check for administrator role
        if (!user.roles.includes('administrator')) {
            console.log("❌ User exists but is not an ADMIN.");
            return res.status(403).json({ message: "Not an admin" });
        }

        console.log("🚀 Admin Access Granted");

        res.json({
            token: "admin-token-999",
            user: {
                id: user._id,
                name: user.name,
                roles: user.roles,
                universityId: user.universityId
            }
        });
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET ALL STUDENTS (for messaging)
router.get('/all-students', async (req, res) => {
    try {
        const students = await User.find({ roles: "student" }).select('name _id universityId');
        res.json(students);
    } catch (err) {
        console.error("Get Students Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
