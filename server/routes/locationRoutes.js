const express = require("express");
const locationController = require("../controllers/locationController");

const router = express.Router();

// CRUD
router.post("/", locationController.createLocation);
router.get("/", locationController.getLocations);
router.get("/:id", locationController.getLocationById);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);

// QR-based lookup
router.get("/qr/:qrCodeRef", locationController.getLocationByQr);

module.exports = router;




