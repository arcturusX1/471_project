const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    groupPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupPost",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    message: { type: String }, // Optional message from applicant
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ groupPost: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

