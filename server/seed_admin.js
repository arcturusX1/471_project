import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/model.js";
import path from "path";
import { fileURLToPath } from "url";

// Setup config to find .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const adminData = {
  name: "System Administrator",
  universityId: "admin123",
  email: "admin@bracu.ac.bd",
  passwordHash: "admin123", // Plain text for now, should be hashed in production
  roles: ["administrator"],
  profile: {
    department: "IT",
    bio: "System Administrator"
  },
  isActive: true
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ universityId: "admin123" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Create admin user
    await User.create(adminData);
    console.log("✅ Successfully created admin user!");
    console.log("Login credentials:");
    console.log("  University ID: admin123");
    console.log("  Password: admin123");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

seedAdmin();
