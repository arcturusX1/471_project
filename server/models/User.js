import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['student', 'faculty', 'admin', 'supervisor'], 
    default: 'student' 
  },
  // Feature 2 Updates:
  availabilityStatus: { 
    type: String, 
    enum: ['Available', 'Busy', 'On Leave'], 
    default: 'Available' 
  },
  supervisionCapacity: { type: Number, default: 5 },
  currentLoad: { type: Number, default: 0 }, // Tracks how many students they have
  timeSlots: [{
    date: { type: String },      // e.g. "2023-12-25"
    startTime: { type: String }, // e.g. "10:00"
    endTime: { type: String },   // e.g. "11:00"
    isBooked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default (mongoose.models.User || mongoose.model('User', userSchema));