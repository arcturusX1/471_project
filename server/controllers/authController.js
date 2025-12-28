import { User } from '../models/model.js';
//const { User } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { name, universityId, email, password, roles, department } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // 1. Manually hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Map fields to your model.js structure
    const user = await User.create({
      name,
      universityId,
      email,
      passwordHash,
      roles: [roles], // Model expects an array
      profile: {
        department
      }
    });

    // 3. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          universityId: user.universityId,
          role: user.roles[0], // Taking the first role from the array
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
    // Find all users who have "Faculty" in their roles array
    const facultyMembers = await User.find({ roles: "Faculty" }).select("name _id");
    res.json(facultyMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

