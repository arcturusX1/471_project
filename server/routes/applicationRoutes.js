const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router.post("/", applicationController.applyToGroup);
router.put("/:applicationId/approve", applicationController.approveApplication);
router.put("/:applicationId/reject", applicationController.rejectApplication);
router.get("/post/:postId", applicationController.getPostApplications);
router.get("/user/:userId", applicationController.getMyApplications);

module.exports = router;

