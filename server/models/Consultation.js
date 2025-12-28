import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  preferredTime: { type: String, required: true },
  faculty: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Consultation = mongoose.model("Consultation", consultationSchema);
export default Consultation;
