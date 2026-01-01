import mongoose from "mongoose";

const savedSearchSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User gives the search a name
  filters: { type: Object } // Stores the actual filter criteria
});

export default mongoose.model('SavedSearch', savedSearchSchema);
