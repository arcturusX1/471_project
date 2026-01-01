import mongoose from "mongoose";
import { PROJECT_STATUS } from '../config/constants.js';

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

const evaluationSchema = new mongoose.Schema({
    evaluatedBy: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 },
    remarks: { type: String, default: "" },
    evaluatedAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: false },

        // Main branch project management fields
        createdBy: { type: String, required: false }, // User ID or string
        members: [{ type: String }], // Array of user IDs or strings
        supervisor: { type: String, default: null }, // User ID or string, nullable
        status: {
            type: String,
            enum: [...Object.values(PROJECT_STATUS), ...STAGE_KEYS],
            default: "draft",
        },
        evaluation: evaluationSchema,

        // Yasir branch project tracking fields
        student: {
            name: { type: String, required: false },
            email: { type: String, required: false },
        },
        supervisorInfo: {
            name: { type: String, required: false },
            email: { type: String, required: false },
        },
        stage: {
            type: String,
            enum: STAGE_KEYS,
            default: "uploaded_draft",
        },
        updates: [updateSchema],

        // Legacy/compatibility fields
        studentName: { type: String, required: false },
        studentId: { type: String, required: false },
        department: { type: String, required: false, default: 'General' },
        supervisorName: { type: String, required: false, default: 'TBD' },
        startDate: { type: Date, required: false, default: Date.now },
        expectedEndDate: { type: Date, required: false, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }, // 1 year from now
    },
    { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
