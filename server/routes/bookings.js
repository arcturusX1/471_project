import express from 'express';
import { Reservation } from '../models/model.js';
import { syncToGoogleCalendar } from '../utils/googleCalendar.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', authenticate, async (req, res) => {
  try {
    const { type, resourceId, startTime, endTime } = req.body;
    const booking = new Reservation({ user: req.user._id, type, resourceId, startTime, endTime });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm booking (and sync to calendar)
router.patch('/:id/confirm', authenticate, async (req, res) => {
  try {
    const booking = await Reservation.findById(req.params.id);
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'CONFIRMED';
    await booking.save();

    try {
      const googleEventId = await syncToGoogleCalendar(booking);
      booking.googleEventId = googleEventId;
      await booking.save();
      console.log('Google Calendar sync successful');
    } catch (syncError) {
      console.log('Google Calendar sync failed, but booking confirmed');
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await Reservation.find({ user: req.user._id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
