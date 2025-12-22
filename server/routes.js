const express = require('express');
const router = express.Router();
const { getProjectTracking } = require('../controllers/projectController');

router.get('/tracking/:id', getProjectTracking);

export default router;
