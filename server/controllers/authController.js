import { User } from '../models/model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * REGISTER
 */
export const registerUser = async (req, res) => {
  const { name, universityId, email, password, roles, department } = req.body;

  try {
    // normalize role
    const normalizedRole = roles.toLowerCase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      universityId,
      email,
      passwordHash,
      roles: [normalizedRole], // MUST be array & lowercase
      profile: { department }
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
        roles: user.roles,
        department: user.profile?.department || ""
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * LOGIN
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
        roles: user.roles,
        department: user.profile?.department || ""
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL FACULTY
 */
export const getAllFaculty = async (req, res) => {
  try {
    const facultyMembers = await User
      .find({ roles: 'faculty' })
      .select('name _id');

    res.json(facultyMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
