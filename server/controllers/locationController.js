import { Location } from "../models/model.js";

// Create a new location
export const createLocation = async (req, res) => {
  try {
    const created = await Location.create(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating location:", err);
    res
      .status(400)
      .json({ error: "Failed to create location", details: err.message });
  }
};

// Get all locations
export const getLocations = async (_req, res) => {
  try {
    const locations = await Location.find().lean();
    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

// Lookup by QR code reference
export const getLocationByQr = async (req, res) => {
  try {
    const { qrCodeRef } = req.params;
    const location = await Location.findOne({ qrCodeRef }).lean();
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (err) {
    console.error("Error fetching location by QR code:", err);
    res.status(500).json({ error: "Failed to fetch location" });
  }
};


// Get location by id
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).lean();
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (err) {
    console.error("Error fetching location by id:", err);
    res.status(500).json({ error: "Failed to fetch location" });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      req.body || {},
      { new: true, runValidators: true, lean: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error updating location:", err);
    res
      .status(400)
      .json({ error: "Failed to update location", details: err.message });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error("Error deleting location:", err);
    res.status(500).json({ error: "Failed to delete location" });
  }
};





