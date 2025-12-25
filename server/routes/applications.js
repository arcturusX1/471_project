import express from 'express';
import Application from '../models/Application.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply for position (only students)
router.post('/', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const { positionType, studentName, email, studentId, gpa, expertise, availability, experience, coverLetter } = req.body;
    const application = new Application({
      student: req.user._id,
      positionType,
      studentName,
      email,
      studentId,
      gpa,
      expertise,
      availability,
      experience,
      coverLetter
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications (assessors see students' apps, admin sees all)
router.get('/', authenticate, async (req, res) => {
  try {
    let applications;
    if (req.user.role === 'ADMIN') {
      applications = await Application.find().populate('student', 'name email').populate('reviewedBy', 'name');
    } else if (req.user.role === 'ASSESSOR') {
      applications = await Application.find().populate('student', 'name email').populate('reviewedBy', 'name');
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept/Reject application (admin/assessor)
router.patch('/:id', authenticate, authorize('ADMIN', 'ASSESSOR'), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    ).populate('student', 'name email');
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
