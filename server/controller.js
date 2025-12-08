// controllers/projectController.js
import Project from 'models/model.js'

exports.getProjectTracking = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId)
      .populate('team', 'name email studentId')
      .populate('supervisors', 'name email role')
      .populate('coSupervisors', 'name email role')
      .populate('submissions.uploadedBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
