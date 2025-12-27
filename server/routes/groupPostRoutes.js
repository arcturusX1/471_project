const express = require("express");
const router = express.Router();
const groupPostController = require("../controllers/groupPostController");

router.post("/", groupPostController.createPost);
router.get("/public", groupPostController.getPublicPosts);
router.get("/my/:userId", groupPostController.getMyPosts);
router.get("/archived/:userId", groupPostController.getArchivedPosts);
router.get("/:id", groupPostController.getPostById);
router.put("/:id", groupPostController.updatePost);
router.put("/:id/archive", groupPostController.archivePost);
router.delete("/:id", groupPostController.deletePost);

module.exports = router;

