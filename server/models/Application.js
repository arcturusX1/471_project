import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  positionType: { type: String, enum: ['ST', 'RA', 'TA'], required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  appliedAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  // Additional fields for detailed application
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  studentId: { type: String, required: true },
  gpa: { type: String, required: true },
  expertise: { type: [String], required: true },
  availability: { type: String, required: true },
  experience: { type: String, required: true },
  coverLetter: { type: String, required: true }
});

export default mongoose.model('Application', applicationSchema);
