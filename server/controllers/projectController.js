const Project = require("../models/Project");

// Progress checkpoints in order
const STAGES = [
  { key: "uploaded_draft", label: "Uploaded Draft" },
  { key: "accepted_by_supervisor", label: "Accepted by Supervisor" },
  { key: "draft_approved", label: "Draft Approved" },
  { key: "final_draft", label: "Final Draft" },
  { key: "final_draft_accepted", label: "Final Draft Accepted" },
  { key: "graded", label: "Graded" },
];

const formatProject = (project) => {
  if (!project) return null;
  const stageIndex = STAGES.findIndex((s) => s.key === project.stage);
  const checkpoints = STAGES.map((stage, idx) => ({
    ...stage,
    completed: stageIndex >= 0 && idx <= stageIndex,
  }));

  return {
    id: project._id.toString(),
    title: project.title,
    student: project.student,
    supervisor: project.supervisor,
    stage: project.stage,
    checkpoints,
    latestUpdate: project.updates?.[0] || null,
    updates: project.updates || [],
  };
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(formatProject(project));
  } catch (err) {
    console.error("Error fetching project by id:", err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

exports.getProjects = async (_req, res) => {
  try {
    const projects = await Project.find().lean();
    res.json(projects.map(formatProject));
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

exports.createProject = async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.stage || !STAGES.find((s) => s.key === payload.stage)) {
      payload.stage = "uploaded_draft";
    }

    const created = await Project.create(payload);
    res.status(201).json(formatProject(created.toObject()));
  } catch (err) {
    console.error("Error creating project:", err);
    res
      .status(400)
      .json({ error: "Failed to create project", details: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const payload = req.body || {};
    if (payload.stage && !STAGES.find((s) => s.key === payload.stage)) {
      return res.status(400).json({ error: "Invalid stage value" });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
      lean: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(formatProject(updated));
  } catch (err) {
    console.error("Error updating project:", err);
    res
      .status(400)
      .json({ error: "Failed to update project", details: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
};




