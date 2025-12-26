import express from 'express';
import { getMyConsultations } from '../controllers/consultationController.js';
import { protect } from '../middleware/authMiddleware.js'; // You'll need this middleware

const router = express.Router();

router.get('/my-consultations', protect, getMyConsultations);

export default router;