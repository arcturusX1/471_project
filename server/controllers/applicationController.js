const Application = require("../models/Application");
const GroupPost = require("../models/GroupPost");
const { User } = require("../models/model");

// Apply to a group
exports.applyToGroup = async (req, res) => {
  try {
    const { groupPostId, applicantId, message } = req.body;

    // Check if post exists and is still accepting members
    const post = await GroupPost.findById(groupPostId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.status === "filled" || post.currentMembers >= post.maxMembers) {
      return res.status(400).json({ error: "Group is already full" });
    }

    // Check if user is already a member
    const isMember = post.members.some(
      (m) => m.user.toString() === applicantId
    );
    if (isMember) {
      return res.status(400).json({ error: "You are already a member" });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      groupPost: groupPostId,
      applicant: applicantId,
    });

    if (existingApplication) {
      return res.status(400).json({
        error: "Application already exists",
        status: existingApplication.status,
      });
    }

    const application = await Application.create({
      groupPost: groupPostId,
      applicant: applicantId,
      message,
    });

    const populated = await Application.findById(application._id)
      .populate("groupPost", "projectName maxMembers currentMembers")
      .populate("applicant", "name email universityId profile");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Error applying to group:", err);
    res.status(400).json({ error: "Failed to apply", details: err.message });
  }
};

// Approve application
exports.approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate("groupPost");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ error: "Application already processed" });
    }

    const post = application.groupPost;

    // Check if group is still accepting members
    if (post.currentMembers >= post.maxMembers) {
      return res.status(400).json({ error: "Group is already full" });
    }

    // Update application status
    application.status = "approved";
    await application.save();

    // Add member to group post
    post.members.push({
      user: application.applicant,
      joinedAt: new Date(),
    });
    post.currentMembers = post.members.length;

    // Update visibility if filled
    if (post.currentMembers >= post.maxMembers) {
      post.status = "filled";
      post.isVisible = false;
    }

    await post.save();

    const updatedApplication = await Application.findById(applicationId)
      .populate("groupPost")
      .populate("applicant", "name email universityId profile");

    res.json(updatedApplication);
  } catch (err) {
    console.error("Error approving application:", err);
    res.status(400).json({ error: "Failed to approve application", details: err.message });
  }
};

// Reject application
exports.rejectApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status: "rejected" },
      { new: true }
    )
      .populate("groupPost")
      .populate("applicant", "name email universityId profile");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(400).json({ error: "Failed to reject application" });
  }
};

// Get applications for a group post
exports.getPostApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      groupPost: req.params.postId,
    })
      .populate("applicant", "name email universityId profile")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Get user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.params.userId,
    })
      .populate("groupPost", "projectName department maxMembers currentMembers status")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

