import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    // For group post applications (yasir branch)
    groupPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupPost",
        required: false,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    message: { type: String }, // Optional message from applicant

    // For position applications (main branch)
    student: { type: String, required: false }, // Demo: using string IDs instead of ObjectId refs
    positionId: { type: String, required: false },
    positionType: { type: String, enum: ['ST', 'RA', 'TA'], required: false },
    reviewedBy: { type: String }, // Demo: using string IDs instead of ObjectId refs
    reviewedAt: { type: Date },

    // Common fields
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "accepted", "PENDING", "ACCEPTED", "REJECTED"],
        default: "pending",
    },
    appliedAt: { type: Date, default: Date.now },

    // Additional fields for detailed application (main branch)
    studentName: { type: String, required: false },
    email: { type: String, required: false },
    studentId: { type: String, required: false },
    gpa: { type: String, required: false },
    expertise: { type: [String], required: false },
    availability: { type: String, required: false },
    experience: { type: String, required: false },
    coverLetter: { type: String, required: false }
});

// Prevent duplicate applications for group posts
applicationSchema.index({ groupPost: 1, applicant: 1 }, { unique: true, sparse: true });

// Prevent duplicate applications for positions
applicationSchema.index({ positionId: 1, student: 1 }, { unique: true, sparse: true });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
