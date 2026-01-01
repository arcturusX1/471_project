import express from "express";
import * as locationController from "../controllers/locationController.js";

const router = express.Router();

// CRUD
router.get("/", locationController.getLocations);
router.get("/:id", locationController.getLocationById);
router.get("/qr/:qrCodeRef", locationController.getLocationByQr);
router.post("/", locationController.createLocation);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);

export default router;
