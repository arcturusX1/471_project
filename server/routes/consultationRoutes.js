import express from 'express';
import {
  getMyConsultations,
  requestConsultation,
  getFacultySchedule,
  submitFeedback
} from '../controllers/consultationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, requestConsultation);
router.get('/my-consultations', protect, getMyConsultations);
router.get('/schedule', protect, getFacultySchedule);
router.put('/:id/feedback', protect, submitFeedback);

// faculty accept / reject
router.put('/:id', protect, async (req, res) => {
  const { status } = req.body;
  const consultation = await ConsultationRequest.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(consultation);
});

export default router;
