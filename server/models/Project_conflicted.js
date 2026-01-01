<<<<<<< HEAD
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
=======

import mongoose from "mongoose";
import { PROJECT_STATUS } from '../config/constants.js';

const evaluationSchema = new mongoose.Schema({
  evaluatedBy: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
  remarks: { type: String, default: "" },
  evaluatedAt: { type: Date, default: Date.now }
});
>>>>>>> main

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
<<<<<<< HEAD
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
=======
    description: { type: String, required: true },
    createdBy: { type: String, required: true }, // User ID or string
    members: [{ type: String }], // Array of user IDs or strings
    supervisor: { type: String, default: null }, // User ID or string, nullable
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: "draft",
    },
    evaluation: evaluationSchema,
    // Legacy fields for backward compatibility
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    studentName: { type: String, required: false },
    studentId: { type: String, required: false },
    department: { type: String, required: false, default: 'General' },
    supervisorName: { type: String, required: false, default: 'TBD' },
    startDate: { type: Date, required: false, default: Date.now },
    expectedEndDate: { type: Date, required: false, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }, // 1 year from now
>>>>>>> main
  },
  { timestamps: true }
);

<<<<<<< HEAD
module.exports = mongoose.model("Project", projectSchema);

=======
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
>>>>>>> main
