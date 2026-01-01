import express from 'express';
import { registerUser, loginUser, getAllFaculty } from '../controllers/authController.js';
import { User } from '../models/model.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin login route (kept from remote implementation)
router.post('/admin-login', async (req, res) => {
  try {
    const { universityId, password } = req.body;
    const user = await User.findOne({ universityId });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const dbPassword = user.passwordHash || user.password;
    if (dbPassword !== password) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.roles.includes('administrator')) return res.status(403).json({ message: 'Not an admin' });
    res.json({ token: 'admin-token-999', user: { id: user._id, name: user.name, roles: user.roles, universityId: user.universityId } });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/faculty', getAllFaculty);

// GET all students (from remote branch)
router.get('/all-students', async (req, res) => {
  try {
    const students = await User.find({ roles: 'student' }).select('name _id universityId');
    res.json(students);
  } catch (err) {
    console.error('Get Students Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
