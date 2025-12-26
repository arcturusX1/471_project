import pkg from '../models/model.js';
const { ConsultationRequest, User } = pkg;

// Get consultations for a specific user
export const getMyConsultations = async (req, res) => {
  try {
    // req.user is populated by the auth middleware we discussed earlier
    const query = req.user.roles.includes('Faculty') 
      ? { faculty: req.user._id } 
      : { requester: req.user._id };

    const consultations = await ConsultationRequest.find(query)
      .populate('requester', 'name email')
      .populate('faculty', 'name email');

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestConsultation = async (req, res) => {
  try {
    const { facultyName, reason, preferredStart } = req.body;

    // 1. Convert Name to ID
    const facultyUser = await User.findOne({ 
      name: { $regex: new RegExp(`^${facultyName}$`, "i") }, 
      roles: "Faculty" 
    });

    if (!facultyUser) {
      return res.status(404).json({ message: "Faculty member not found. Please verify the name." });
    }

    // 2. Save using the ID
    await ConsultationRequest.create({
      requester: req.user._id,
      faculty: facultyUser._id, 
      reason,
      preferredStart,
      status: 'Pending'
    });

    res.status(201).json({ message: "Request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};