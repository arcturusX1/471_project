import express from "express";
import * as groupPostController from "../controllers/groupPostController.js";

const router = express.Router();

router.get("/", groupPostController.getPublicPosts);
router.get("/my/:userId", groupPostController.getMyPosts);
router.get("/archived/:userId", groupPostController.getArchivedPosts);
router.get("/:id", groupPostController.getPostById);
router.post("/", groupPostController.createPost);
router.put("/:id", groupPostController.updatePost);
router.patch("/:id/archive", groupPostController.archivePost);
router.post("/:id/apply", groupPostController.applyToPost);
router.post("/:id/leave", groupPostController.leavePost);
router.delete("/:id", groupPostController.deletePost);

export default router;
