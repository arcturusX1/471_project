import express from 'express';
const router = express.Router();

// Dummy endpoint to prevent frontend 404s
router.get('/my-consultations', (req, res) => {
    res.json([]); // Return empty array
});

export default router;
