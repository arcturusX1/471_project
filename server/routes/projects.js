import express from "express";
import { Project } from "../models/model.js";
import { mockAuth, requireRole } from "../middleware/mockAuth.js";

const router = express.Router();

// =================================================================
// HELPER: STATUS BADGE LOGIC (Fixed Priority from zebin_branch)
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

// Test endpoint to verify routing works
router.get("/test", (req, res) => {
  console.log('🧪 TEST ENDPOINT CALLED');
  res.json({ message: "Project routes working", timestamp: new Date().toISOString() });
});

/**
 * POST /api/projects
 * Create a new project (faculty only)
 */
router.post("/", mockAuth, requireRole('faculty'), async (req, res) => {
  try {
    console.log('📝 FACULTY CREATING PROJECT');
    console.log('📝 REQUEST BODY:', req.body);
    console.log('📝 USER:', req.user);

    const {
      title,
      description,
      assignSelfAsSupervisor = false
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    // Create project data
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      createdBy: req.user.id,
      members: [req.user.id], // Auto-add creator to members
      supervisor: assignSelfAsSupervisor ? req.user.id : null,
      status: "draft"
    };

    console.log('📝 CREATING PROJECT WITH DATA:', projectData);

    const project = await Project.create(projectData);

    console.log('✅ PROJECT CREATED SUCCESSFULLY:', project._id);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    console.error('❌ PROJECT CREATION FAILED:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      details: error.message
    });
  }
});

/**
 * GET /api/projects/mine
 * Get user's projects
 */
router.get("/mine", mockAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get projects where user is creator or member
    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { members: userId }
      ]
    }).sort({ createdAt: -1 });

    // Apply normalized status to each project
    const normalizedProjects = projects.map(project => {
      const projectObj = project.toObject();
      projectObj.normalizedStatus = normalizeStatus(projectObj);
      return projectObj;
    });

    console.log(`📋 RETRIEVED ${projects.length} PROJECTS FOR USER ${userId}`);

    res.json({
      success: true,
      count: projects.length,
      data: normalizedProjects
    });
  } catch (error) {
    console.error('❌ FAILED TO GET USER PROJECTS:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get projects'
    });
  }
});

/**
 * GET /api/projects
 * Get all projects (faculty/admin only)
 */
router.get("/", mockAuth, requireRole('faculty', 'admin'), async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    
    // Apply normalized status to each project
    const normalizedProjects = projects.map(project => {
      const projectObj = project.toObject();
      projectObj.normalizedStatus = normalizeStatus(projectObj);
      return projectObj;
    });
    
    console.log(`📋 RETRIEVED ${projects.length} PROJECTS FROM MONGODB`);

    res.json({
      success: true,
      count: projects.length,
      data: normalizedProjects
    });
  } catch (error) {
    console.error('❌ FAILED TO GET ALL PROJECTS:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get projects'
    });
  }
});

/**
 * GET /api/projects/:id
 * Get single project by ID
 */
router.get('/:id', mockAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check authorization - user must be creator, member, or faculty/admin
    const userId = req.user.id;
    const isAuthorized =
      project.createdBy === userId ||
      project.members.includes(userId) ||
      ['faculty', 'admin'].includes(req.user.role);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update project
 */
router.put('/:id', mockAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check authorization
    const userId = req.user.id;
    const isAuthorized =
      project.createdBy === userId ||
      project.members.includes(userId) ||
      ['faculty', 'admin'].includes(req.user.role);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this project'
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project
 */
router.delete('/:id', mockAuth, requireRole('admin'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Only admin can delete
    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PATCH /api/projects/:id/supervisor/me
 * Set current faculty as supervisor (faculty only)
 */
router.patch("/:id/supervisor/me", mockAuth, requireRole('faculty'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    console.log(`👨‍🏫 FACULTY ${userId} SETTING SELF AS SUPERVISOR FOR PROJECT ${projectId}`);

    // Find project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is authorized (must be creator or member)
    if (project.createdBy !== userId && !project.members.includes(userId)) {
      return res.status(403).json({
        error: 'Not authorized. You must be the creator or a member of this project.'
      });
    }

    // Update supervisor
    project.supervisor = userId;
    await project.save();

    console.log('✅ SUPERVISOR SET SUCCESSFULLY');

    res.status(200).json({
      success: true,
      message: 'Successfully set as supervisor',
      data: project
    });

  } catch (error) {
    console.error('❌ SET SUPERVISOR FAILED:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set supervisor',
      details: error.message
    });
  }
});

/**
 * PATCH /api/projects/:id/evaluate
 * Evaluate project (faculty only - must be supervisor)
 */
router.patch("/:id/evaluate", mockAuth, requireRole('faculty'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const { marks, remarks, status } = req.body;

    console.log(`📊 FACULTY ${userId} EVALUATING PROJECT ${projectId}`);

    // Find project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is the supervisor
    if (project.supervisor !== userId) {
      return res.status(403).json({
        error: 'Not authorized. You must be the supervisor of this project.'
      });
    }

    // Validate marks
    if (marks === undefined || marks < 0 || marks > 100) {
      return res.status(400).json({ error: 'Marks must be between 0 and 100' });
    }

    // Create evaluation
    const evaluation = {
      evaluatedBy: userId,
      marks: Number(marks),
      remarks: remarks || '',
      evaluatedAt: new Date()
    };

    // Update project
    project.evaluation = evaluation;
    if (status) {
      project.status = status; // Optional status update
    }

    await project.save();

    console.log('✅ PROJECT EVALUATED SUCCESSFULLY');

    res.status(200).json({
      success: true,
      message: 'Project evaluated successfully',
      data: project
    });

  } catch (error) {
    console.error('❌ PROJECT EVALUATION FAILED:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate project',
      details: error.message
    });
  }
});

export default router;
