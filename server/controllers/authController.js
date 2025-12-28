// server/controllers/authController.js
import { User } from '../models/model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { name, universityId, email, password, roles, department } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      universityId,
      email: email.toLowerCase(),
      passwordHash,
      roles: [roles.toLowerCase()], // Store as lowercase array to match model.js
      profile: { department }
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        roles: user.roles // Returns array ['student'] or ['faculty']
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          universityId: user.universityId,
          roles: user.roles, // Changed from role to roles (Array)
          department: user.profile?.department || "N/A"
        }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    // Search for lowercase 'faculty' to match model enum
    const facultyMembers = await User.find({ roles: "faculty" }).select("name _id");
    res.json(facultyMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};