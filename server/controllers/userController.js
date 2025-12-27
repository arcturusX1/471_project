const { User } = require("../models/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

exports.registerUser = async (req, res) => {
  const { name, universityId, email, password, roles, department } = req.body;

  try {
    // Validate required fields
    if (!name || !universityId || !email || !password) {
      return res.status(400).json({ 
        message: "Missing required fields: name, universityId, email, and password are required" 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if universityId already exists
    const idExists = await User.findOne({ universityId });
    if (idExists) {
      return res.status(400).json({ message: "University ID already exists" });
    }

    // Manually hash the password
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: "Invalid password" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Map fields to model structure
    const userData = {
      name,
      universityId,
      email,
      passwordHash,
      roles: roles ? [roles] : ["Student"], // Model expects an array
    };

    // Only add profile if department is provided
    if (department && department.trim()) {
      userData.profile = {
        department: department.trim(),
      };
    }

    const user = await User.create(userData);

    // Generate Token
    if (!user._id) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    if (!JWT_SECRET || JWT_SECRET === "your-secret-key-change-in-production") {
      console.warn("Warning: Using default JWT secret. Set JWT_SECRET environment variable for production.");
    }

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: "30d" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        roles: user.roles,
        email: user.email,
        universityId: user.universityId,
        department: user.profile?.department,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.passwordHash) {
      return res.status(500).json({ message: "User account error" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user._id) {
      return res.status(500).json({ message: "User data error" });
    }

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: "30d" });

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          universityId: user.universityId,
          role: user.roles[0], // Taking the first role from the array
          roles: user.roles,
          department: user.profile?.department || "N/A",
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFaculty = async (req, res) => {
  try {
    // Find all users who have "Faculty" in their roles array
    const facultyMembers = await User.find({ roles: "Faculty" }).select("name _id");
    res.json(facultyMembers);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
