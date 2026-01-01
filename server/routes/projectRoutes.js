const express = require('express');
const router = express.Router();
const { Project, User, SupervisorAssignment } = require('../models/model.js');
const projectController = require("../controllers/projectController");

// Simple CRUD routes from yasir branch
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

// =================================================================
// HELPER: STATUS BADGE LOGIC (Fixed Priority)
// =================================================================
const normalizeStatus = (p) => {
    // 1. Get raw values
    const stage = p.stage ? p.stage.toLowerCase().trim() : '';
    const status = p.status ? p.status.toLowerCase().trim() : '';

    // 2. CHECK "COMPLETED" (Green)
    if (stage === 'final_draft_accepted') return 'completed';
    if (status === 'completed' || status === 'final') return 'completed';

    // 3. CHECK "IN PROGRESS" (Blue)
    // FIX: We check BOTH fields. If either says "in progress", return 'in-progress'.
    if (stage === 'draft_approved') return 'in-progress';
    if (status === 'in-progress' || status === 'in progress') return 'in-progress';
    if (status === 'accepted_by_supervisor') return 'in-progress';

    // Legacy check: some data might store "In Progress" with different casing
    if (status.includes('in progress')) return 'in-progress';

    // 4. CHECK "UNDER REVIEW" (Orange)
    if (stage === 'uploaded_draft') return 'under_review';
    if (status === 'under_review' || status === 'under-review') return 'under_review';
    if (status.includes('under review')) return 'under_review';

    // 5. DEFAULT -> PROPOSAL (Yellow)
    return 'proposal';
};

// =================================================================
// 1. SEARCH PROJECTS (STRICT MATCHING)
// =================================================================
router.get('/search', async (req, res) => {
    try {
        const { title, status, department } = req.query;
        let filter = {};

        // A. Title
        if (title) filter.title = { $regex: title, $options: 'i' };

        // B. Department
        if (department) {
            if (department.toUpperCase() === 'CSE') {
                filter.$or = [
                    { department: { $regex: 'CSE', $options: 'i' } },
                    { department: null },
                    { department: "" },
                    { department: { $exists: false } }
                ];
            } else {
                filter.department = { $regex: department, $options: 'i' };
            }
        }

        // C. Status Filter (The Logic Fix)
        if (status && status !== "") {
            const s = status.toLowerCase();

            if (s === 'completed') {
                filter.$or = [
                    { stage: 'final_draft_accepted' },
                    { status: 'completed' },
                    { status: 'final' }
                ];
            }
            else if (s === 'in-progress') {
                filter.$or = [
                    { stage: 'draft_approved' },
                    { status: 'in-progress' },
                    { status: 'in progress' },
                    { status: 'accepted_by_supervisor' }
                ];
            }
            else if (s === 'under_review') {
                filter.$or = [
                    { stage: 'uploaded_draft' },
                    { status: 'under_review' },
                    { status: 'under-review' }
                ];
            }
            else if (s === 'proposal') {
                // Proposal means "NONE of the advanced stages exist"
                filter.$and = [
                    { stage: { $ne: 'final_draft_accepted' } },
                    { stage: { $ne: 'draft_approved' } },
                    { stage: { $ne: 'uploaded_draft' } },
                    { status: { $ne: 'in-progress' } },
                    { status: { $ne: 'in progress' } },
                    { status: { $ne: 'accepted_by_supervisor' } },
                    { status: { $ne: 'completed' } }
                ];
            }
            else {
                // Fallback for typed searches
                filter.$or = [{ status: s }, { stage: s }];
            }
        }

        const projects = await Project.find(filter)
            .populate('supervisors', 'name')
            .lean();

        const formattedProjects = await Promise.all(projects.map(async (p) => {
            let supervisorName = "Unassigned";
            if (p.supervisors && p.supervisors.length > 0 && p.supervisors[0].name) {
                supervisorName = p.supervisors[0].name;
            } else if (p.supervisor && p.supervisor.name) {
                supervisorName = p.supervisor.name;
            }

            const assignments = await SupervisorAssignment.find({ project: p._id })
                .populate('supervisor', 'name')
                .populate('assignedBy', 'name')
                .sort({ createdAt: 1 });

            const historyLog = assignments.map(a => ({
                assignedBy: a.assignedBy?.name || "Admin",
                new: a.supervisor?.name,
                date: a.createdAt
            }));

            return {
                ...p,
                supervisorName,
                assignedHistory: historyLog,
                status: normalizeStatus(p), // <--- This now strictly follows the same rules as the filter
                department: (p.department && p.department !== '-') ? p.department : 'CSE'
            };
        }));

        res.json(formattedProjects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =================================================================
// 2. ASSIGN / REMOVE SUPERVISOR
// =================================================================
router.put('/assign', async (req, res) => {
    const { projectId, supervisorName, adminName } = req.body;

    try {
        const isRemoval = !supervisorName || supervisorName === "Unassigned" || supervisorName.trim() === "";

        if (isRemoval) {
            await Project.findByIdAndUpdate(projectId, {
                $set: { supervisors: [] },
                $unset: { supervisor: 1 }
            }, { strict: false });
            return res.json({ success: true, message: "Supervisor removed" });
        }

        const supervisorUser = await User.findOne({
            name: { $regex: new RegExp(`^${supervisorName.trim()}$`, 'i') }
        });

        if (!supervisorUser) {
            return res.status(400).json({ message: `User "${supervisorName}" not found` });
        }

        const project = await Project.findById(projectId).lean();
        if (!project) return res.status(404).json({ message: "Project not found" });

        let updateFields = { supervisors: [supervisorUser._id] };

        // Force 'in-progress' status if assigning a supervisor to a proposal
        if (!project.status || project.status === 'proposal') {
            updateFields.status = 'in-progress';
        }

        if (!project.department) updateFields.department = 'CSE';

        await Project.findByIdAndUpdate(projectId, {
            $set: updateFields,
            $unset: { supervisor: 1 }
        }, { runValidators: false, strict: false });

        const adminUser = await User.findOne({ name: adminName }) || await User.findOne();
        try {
            await SupervisorAssignment.create({
                project: projectId,
                supervisor: supervisorUser._id,
                assignedBy: adminUser?._id,
                role: 'supervisor'
            });
        } catch (e) { console.log("History error", e.message); }

        res.json({ success: true, message: "Assigned successfully" });

    } catch (err) {
        console.error("Assign Error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
