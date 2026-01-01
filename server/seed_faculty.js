import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import path from "path";
import { fileURLToPath } from "url";

// 1. Setup config to find .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const facultyData = [
  { name: "Dr. Ayesha Siddiqua", email: "ayesha.s@bracu.ac.bd", role: "faculty", availabilityStatus: "Available", supervisionCapacity: 8, currentLoad: 2 },
  { name: "Dr. M. Kaykobad", email: "kaykobad@bracu.ac.bd", role: "faculty", availabilityStatus: "Busy", supervisionCapacity: 5, currentLoad: 5 },
  { name: "Dr. Md. Golam Rabiul", email: "rabiul@bracu.ac.bd", role: "faculty", availabilityStatus: "Available", supervisionCapacity: 6, currentLoad: 4 },
  { name: "Sadia Hamid Kazi", email: "sadia.kazi@bracu.ac.bd", role: "faculty", availabilityStatus: "On Leave", supervisionCapacity: 4, currentLoad: 0 },
  { name: "Annajiat Alim Rasel", email: "annajiat@bracu.ac.bd", role: "faculty", availabilityStatus: "Available", supervisionCapacity: 10, currentLoad: 1 },
  { name: "Dr. Amitabha Chakrabarty", email: "amitabha@bracu.ac.bd", role: "faculty", availabilityStatus: "Busy", supervisionCapacity: 5, currentLoad: 5 },
  { name: "Hossain Arif", email: "hossain.arif@bracu.ac.bd", role: "faculty", availabilityStatus: "Available", supervisionCapacity: 7, currentLoad: 3 },
  { name: "Dr. Jia Uddin", email: "jia.uddin@bracu.ac.bd", role: "faculty", availabilityStatus: "Available", supervisionCapacity: 8, currentLoad: 6 },
  { name: "Rubana Ahmed", email: "rubana@bracu.ac.bd", role: "faculty", availabilityStatus: "On Leave", supervisionCapacity: 4, currentLoad: 0 },
  { name: "Samiul Islam", email: "samiul@bracu.ac.bd", role: "faculty", availabilityStatus: "Available", supervisionCapacity: 6, currentLoad: 2 },
  { name: "Farah Sophia", email: "farah.s@bracu.ac.bd", role: "faculty", availabilityStatus: "Busy", supervisionCapacity: 3, currentLoad: 3 },
  { name: "Dipankar Chaki", email: "dipankar@bracu.ac.bd", role: "faculty", availabilityStatus: "Available", supervisionCapacity: 5, currentLoad: 1 }
];

const seedFaculty = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database...");

    // Clear existing faculty to avoid duplicates (Optional, but cleaner)
    await User.deleteMany({ role: "faculty" });
    console.log("Cleared old faculty data...");

    // Insert new faculty
    await User.insertMany(facultyData);
    
    console.log("✅ Successfully added 12 Faculty Members!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

seedFaculty();