import { ConsultationRequest, User } from '../models/model.js';

/**
 * GET my consultations (student or faculty)
 */
export const getMyConsultations = async (req, res) => {
  try {
    const isFaculty = req.user.roles.includes('faculty');

    const query = req.user.roles.includes('faculty')
      ? { faculty: req.user._id }
      : { requester: req.user._id };

    const consultations = await ConsultationRequest.find(query)
      .populate('requester', 'name universityId')
      .populate('faculty', 'name');

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STUDENT → REQUEST CONSULTATION
 */
export const requestConsultation = async (req, res) => {
  try {
    const { faculty, reason, preferredStart } = req.body;

    const facultyUser = await User.findById(faculty);
    if (!facultyUser || !facultyUser.roles.includes('faculty')) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const consultation = await ConsultationRequest.create({
      requester: req.user._id,
      faculty: facultyUser._id,
      reason,
      preferredStart,
      status: 'Pending'
    });

    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * FACULTY → ACCEPT / DECLINE
 */
export const updateConsultationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted','declined','cancelled','completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const consultation = await ConsultationRequest.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      { status },
      { new: true }
    );

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * FACULTY SCHEDULE (accepted only)
 */
export const getFacultySchedule = async (req, res) => {
  try {
    const sessions = await ConsultationRequest.find({
      faculty: req.user._id,
      status: 'accepted'
    })
      .populate('requester', 'name universityId')
      .sort({ preferredStart: 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * STUDENT → SUBMIT FEEDBACK
 */
export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const consultation = await ConsultationRequest.findOneAndUpdate(
      { _id: req.params.id, requester: req.user._id },
      {
        feedbackForST: {
          rating,
          comment,
          submittedBy: req.user._id,
          submittedAt: new Date()
        },
        status: 'completed'
      },
      { new: true }
    );

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
