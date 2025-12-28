import express from 'express';
import { registerUser, loginUser, getAllFaculty } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/faculty', getAllFaculty);

export default router;