import express from 'express';
const router = express.Router();
import mongoose from 'mongoose'; 
import { User } from '../models/model.js';

// --- HELPER: Day Mapping ---
const daysMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
const revDaysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// =================================================================
// 1. GET ALL FACULTY (CRITICAL FOR STUDENT VIEW)
// =================================================================
router.get('/all', async (req, res) => {
    try {
        // .lean() gets all data including legacy/schema-less fields
        const faculty = await User.find({
            $or: [{ roles: 'faculty' }, { role: 'faculty' }]
        }).lean(); 
        
        const safeFaculty = faculty.map(f => {
            // Fix Availability Status (Read from flat or nested)
            let rawStatus = f.availabilityStatus || (f.availability && f.availability.status) || 'available';
            let cleanStatus = rawStatus.toLowerCase();

            // Format Slots for Dropdown
            const formattedSlots = f.timeSlots?.map(slot => ({
                day: revDaysMap[slot.dayOfWeek] || 'Monday',
                start: slot.from,
                end: slot.to
            })) || [];

            return {
                _id: f._id,
                name: f.name,
                email: f.email,
                role: f.role || 'faculty',
                availability: { status: cleanStatus }, // StudentView expects this nested structure
                capacity: f.supervisionCapacity || 0,
                slots: formattedSlots,
                profile: { 
                    department: f.department || 'CSE', 
                    office: f.office || 'UB 00' 
                }
            };
        });

        res.json(safeFaculty);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =================================================================
// 2. GET SINGLE FACULTY PROFILE (For Supervisor View)
// =================================================================
router.get('/:idOrName', async (req, res) => {
    try {
        const { idOrName } = req.params;
        let query = {};

        if (mongoose.Types.ObjectId.isValid(idOrName)) {
            query = { _id: idOrName };
        } else {
            query = { name: { $regex: idOrName, $options: 'i' } };
        }

        const faculty = await User.findOne(query).lean();

        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        const formattedSlots = faculty.timeSlots?.map(slot => ({
            day: revDaysMap[slot.dayOfWeek] || 'Monday',
            start: slot.from,
            end: slot.to
        })) || [];

        let rawStatus = faculty.availabilityStatus || (faculty.availability && faculty.availability.status) || 'available';

        res.json({
            name: faculty.name,
            universityId: faculty._id,
            availability: rawStatus,
            capacity: faculty.supervisionCapacity || 0,
            slots: formattedSlots
        });

    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// =================================================================
// 3. UPDATE PROFILE (Supervisor View - Strict Mode Bypass)
// =================================================================
router.put('/update', async (req, res) => {
    const { universityId, availability, capacity, slots } = req.body;

    try {
        const dbSlots = slots.map(s => ({
            dayOfWeek: daysMap[s.day] !== undefined ? daysMap[s.day] : 1,
            from: s.start,
            to: s.end
        }));

        // strict: false allows saving fields not in model.js
        const updatedUser = await User.findByIdAndUpdate(
            universityId, 
            {
                $set: {
                    availabilityStatus: availability,
                    supervisionCapacity: capacity,
                    timeSlots: dbSlots
                }
            },
            { new: true, strict: false } 
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ success: true, message: "Updated successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;