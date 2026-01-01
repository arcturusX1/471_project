import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getMyConsultations,
  requestConsultation,
  getFacultySchedule,
  submitFeedback,
  updateConsultationStatus
} from '../controllers/consultationController.js';

const router = express.Router();

// Student creates a request
router.post('/request', protect, requestConsultation);

// Get consultations (student/faculty)
router.get('/my-consultations', protect, getMyConsultations);

// Faculty schedule
router.get('/schedule', protect, getFacultySchedule);

// Feedback submission (student)
router.put('/:id/feedback', protect, submitFeedback);

// Faculty accepts/declines consultation
router.put('/:id', protect, updateConsultationStatus);

export default router;
