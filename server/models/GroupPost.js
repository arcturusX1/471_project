import mongoose from "mongoose";

const groupPostSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    details: { type: String, required: true },
    department: { type: String, required: true },
    maxMembers: { type: Number, required: true, min: 1 },
    currentMembers: { type: Number, default: 0, min: 0 },
    supervisorName: { type: String, required: true },
    techStack: [{ type: String }], // Optional array of technologies
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["active", "filled", "archived"],
      default: "active",
    },
    isVisible: { type: Boolean, default: true }, // Controls visibility in public feed
  },
  { timestamps: true }
);

// Update visibility when members are filled
groupPostSchema.pre("save", function (next) {
  // Update currentMembers based on members array length
  if (this.members && Array.isArray(this.members)) {
    this.currentMembers = this.members.length;
  }

  if (this.currentMembers >= this.maxMembers) {
    this.status = "filled";
    this.isVisible = false; // Hide from public feed when filled
  }

  if (typeof next === "function") {
    next();
  }
});

export default mongoose.model("GroupPost", groupPostSchema);

