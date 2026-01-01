import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/model.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const studentsData = [
  {
    name: "John Doe",
    universityId: "2021001",
    email: "john.doe@student.bracu.ac.bd",
    passwordHash: "student123",
    roles: ["student"],
    profile: {
      department: "CSE",
      program: "BSc in Computer Science"
    },
    isActive: true
  },
  {
    name: "Jane Smith",
    universityId: "2021002",
    email: "jane.smith@student.bracu.ac.bd",
    passwordHash: "student123",
    roles: ["student"],
    profile: {
      department: "EEE",
      program: "BSc in Electrical Engineering"
    },
    isActive: true
  }
];

const seedStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database...");

    await User.deleteMany({ roles: "student" });
    console.log("Cleared old student data...");

    await User.insertMany(studentsData);
    console.log("✅ Successfully created sample students!");
    console.log("Student login credentials:");
    console.log("  Email: john.doe@student.bracu.ac.bd | Password: student123");
    console.log("  Email: jane.smith@student.bracu.ac.bd | Password: student123");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

seedStudents();
