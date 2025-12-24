import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  supervisorName: { type: String, default: "Unassigned" }, 
  status: { 
    type: String, 
    enum: ['proposal', 'in-progress', 'under review', 'completed'],
    default: 'proposal'
  },
  stage: { 
    type: String, 
    enum: ['proposal', 'midterm', 'final'],
    default: 'proposal'
  },
  studentId: { type: String },
  department: { type: String },
  tags: [String], 
  grade: { type: Number, default: 0 },
  
  // --- NEW FIELD FOR SUPERVISOR ASSIGNMENT MODULE ---
  // Stores the log of who assigned the supervisor and when
  assignedHistory: [{
    assignedBy: { type: String }, // Admin ID or Name
    previousSupervisor: { type: String },
    newSupervisor: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],

  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);