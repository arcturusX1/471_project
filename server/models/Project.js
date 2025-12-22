const mongoose = require("mongoose");

const STAGE_KEYS = [
  "uploaded_draft",
  "accepted_by_supervisor",
  "draft_approved",
  "final_draft",
  "final_draft_accepted",
  "graded",
];

const updateSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    student: {
      name: { type: String, required: true },
      email: { type: String },
    },
    supervisor: {
      name: { type: String, required: true },
      email: { type: String },
    },
    stage: {
      type: String,
      enum: STAGE_KEYS,
      default: "uploaded_draft",
    },
    updates: [updateSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);

