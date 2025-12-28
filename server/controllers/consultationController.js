import { ConsultationRequest, User } from '../models/model.js';

/**
 * Student requests a consultation
 */
export const requestConsultation = async (req, res) => {
  const { faculty, reason, preferredStart } = req.body;

  try {
    if (!faculty || !reason || !preferredStart) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const facultyUser = await User.findById(faculty);
    if (!facultyUser || !facultyUser.roles.includes('faculty')) {
      return res.status(404).json({ message: 'Faculty not found.' });
    }

    const newRequest = await ConsultationRequest.create({
      requester: req.user._id,
      faculty,
      reason,
      preferredStart,
      status: 'requested'
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create consultation request.' });
  }
};

/**
 * Get consultations for current user
 */
export const getMyConsultations = async (req, res) => {
  try {
    let consultations;

    if (req.user.roles.includes('faculty')) {
      consultations = await ConsultationRequest.find({ faculty: req.user._id })
        .populate('requester', 'name universityId email')
        .sort({ createdAt: -1 });
    } else {
      consultations = await ConsultationRequest.find({ requester: req.user._id })
        .populate('faculty', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch consultations.' });
  }
};

/**
 * Faculty accepts or declines consultation
 */
export const updateConsultationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const consultation = await ConsultationRequest.findById(id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found.' });
    }

    // Only the assigned faculty can update
    if (!req.user.roles.includes('faculty') || consultation.faculty.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    consultation.status = status;

    if (status === 'accepted') {
      consultation.confirmedStart = consultation.preferredStart;
    }

    // Save without deleting
    await consultation.save();
    res.json(consultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update consultation status.' });
  }
};

/**
 * Faculty view schedule (accepted consultations)
 */
export const getFacultySchedule = async (req, res) => {
  try {
    if (!req.user.roles.includes('faculty')) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const sessions = await ConsultationRequest.find({
      faculty: req.user._id,
      status: 'accepted'
    }).populate('requester', 'name universityId')
      .sort({ confirmedStart: 1 });

    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch schedule.' });
  }
};

/**
 * Student submits feedback for ST
 */
export const submitFeedback = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const consultation = await ConsultationRequest.findById(id);

    if (!consultation) return res.status(404).json({ message: 'Consultation not found.' });

    if (consultation.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    consultation.feedbackForST = {
      rating,
      comment,
      submittedBy: req.user._id,
      submittedAt: new Date()
    };

    await consultation.save();
    res.json(consultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit feedback.' });
  }
};
