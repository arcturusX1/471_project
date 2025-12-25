const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { department, status, studentId } = req.query;
    
    let filter = {};
    
    // Apply filters
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (studentId) filter.studentId = studentId;
    
    // Students can only see their own projects (unless admin/faculty)
    if (req.user.role === 'student') {
      filter.studentUserId = req.user.id;
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate('studentUserId', 'name email');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('studentUserId', 'name email studentId');

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    // Students can only view their own projects
    if (req.user.role === 'student' && project.studentUserId._id.toString() !== req.user.id) {
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

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Student only)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      startDate,
      endDate,
      supervisor
    } = req.body;

    // Create project with logged-in user's info
    const project = await Project.create({
      title,
      studentName: req.user.name,
      studentId: req.user.studentId,
      studentUserId: req.user.id,
      description,
      department,
      startDate,
      endDate,
      supervisor,
      status: 'Planning'
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Student - own project, Admin/Faculty - all)
router.put('/:id', protect, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    // Check ownership (students can only update their own projects)
    if (req.user.role === 'student' && project.studentUserId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this project' 
      });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only, or student - own project)
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    // Only admin or the student who created it can delete
    if (req.user.role !== 'admin' && project.studentUserId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to delete this project' 
      });
    }

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

module.exports = router;
