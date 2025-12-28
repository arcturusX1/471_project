import express from 'express';
import { getMyConsultations } from '../controllers/consultationController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/my-consultations', protect, getMyConsultations);

export default router;