import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  supervisorName: { type: String, required: true },
  startDate: { type: Date, required: true },
  expectedEndDate: { type: Date, required: true },
  status: { type: String, enum: ['SUBMITTED', 'IN_REVIEW', 'EVALUATED'], default: 'SUBMITTED' }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);
