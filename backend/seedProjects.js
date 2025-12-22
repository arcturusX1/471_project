const mongoose = require("mongoose");
const Project = require("./models/Project");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://db_connect:9wnOGOZ4RVGtCttH@cluster0.puwqhsb.mongodb.net/?appName=Cluster0";

const projects = [
  {
    title: "Design and Implementation of a Smart Attendance System",
    student: { name: "Alice Johnson", email: "alice.johnson@example.com" },
    supervisor: { name: "Dr. Michael Smith", email: "msmith@example.com" },
    stage: "uploaded_draft",
    updates: [
      {
        message: "Initial proposal submitted",
        date: new Date("2025-01-15T10:00:00.000Z"),
      },
      {
        message: "Alice joined your team",
        date: new Date("2025-01-20T09:30:00.000Z"),
      },
    ],
  },
  {
    title: "IoT-Based Energy Monitoring for Campus Buildings",
    student: { name: "Brian Lee", email: "brian.lee@example.com" },
    supervisor: { name: "Prof. Sarah Ahmed", email: "sahmed@example.com" },
    stage: "accepted_by_supervisor",
    updates: [
      {
        message: "Supervisor has accepted your draft",
        date: new Date("2025-02-02T14:15:00.000Z"),
      },
      {
        message: "A co-supervisor was assigned to your project",
        date: new Date("2025-02-05T11:00:00.000Z"),
      },
    ],
  },
  {
    title: "Machine Learning for Early Disease Detection",
    student: { name: "Cynthia Green", email: "cynthia.green@example.com" },
    supervisor: { name: "Dr. Peter Wong", email: "pwong@example.com" },
    stage: "draft_approved",
    updates: [
      {
        message: "Draft document approved by supervisor",
        date: new Date("2025-02-18T16:45:00.000Z"),
      },
    ],
  },
  {
    title: "Mobile App for Campus Navigation Using QR Codes",
    student: { name: "David Kim", email: "david.kim@example.com" },
    supervisor: { name: "Dr. Rachel Turner", email: "rturner@example.com" },
    stage: "final_draft",
    updates: [
      {
        message: "Alice joined your team",
        date: new Date("2025-03-01T09:00:00.000Z"),
      },
      {
        message: "Final draft submitted for review",
        date: new Date("2025-03-10T13:20:00.000Z"),
      },
    ],
  },
  {
    title: "Blockchain-Based Certificate Verification System",
    student: { name: "Emily Davis", email: "emily.davis@example.com" },
    supervisor: { name: "Prof. James O'Neil", email: "joneil@example.com" },
    stage: "final_draft_accepted",
    updates: [
      {
        message: "A co-supervisor was assigned to your project",
        date: new Date("2025-03-05T11:30:00.000Z"),
      },
      {
        message: "Final draft accepted by supervisor",
        date: new Date("2025-03-18T15:00:00.000Z"),
      },
    ],
  },
  {
    title: "Facial Recognition-Based Library Access Control",
    student: { name: "Frank Miller", email: "frank.miller@example.com" },
    supervisor: { name: "Dr. Helen Zhou", email: "hzhou@example.com" },
    stage: "graded",
    updates: [
      {
        message: "Presentation completed",
        date: new Date("2025-03-25T10:00:00.000Z"),
      },
      {
        message: "Project graded: A-",
        date: new Date("2025-03-30T12:30:00.000Z"),
      },
    ],
  },
  {
    title: "Real-Time Traffic Monitoring Using Computer Vision",
    student: { name: "Grace Park", email: "grace.park@example.com" },
    supervisor: { name: "Prof. Daniel Rossi", email: "drossi@example.com" },
    stage: "uploaded_draft",
    updates: [
      {
        message: "Initial draft uploaded",
        date: new Date("2025-04-01T09:15:00.000Z"),
      },
    ],
  },
  {
    title: "Campus Event Management and Ticketing Platform",
    student: { name: "Henry Wilson", email: "henry.wilson@example.com" },
    supervisor: { name: "Dr. Olivia Brooks", email: "obrooks@example.com" },
    stage: "accepted_by_supervisor",
    updates: [
      {
        message: "Supervisor has accepted your draft",
        date: new Date("2025-04-05T14:00:00.000Z"),
      },
      {
        message: "Alice joined your team",
        date: new Date("2025-04-07T10:45:00.000Z"),
      },
    ],
  },
  {
    title: "Data Analytics Dashboard for Student Performance",
    student: { name: "Isabella Lopez", email: "isabella.lopez@example.com" },
    supervisor: { name: "Prof. Mark Tan", email: "mtan@example.com" },
    stage: "draft_approved",
    updates: [
      {
        message: "Draft document approved by supervisor",
        date: new Date("2025-04-12T11:20:00.000Z"),
      },
      {
        message: "A co-supervisor was assigned to your project",
        date: new Date("2025-04-15T09:50:00.000Z"),
      },
    ],
  },
  {
    title: "Recommendation System for Course Selection",
    student: { name: "Jack Thomas", email: "jack.thomas@example.com" },
    supervisor: { name: "Dr. Priya Nair", email: "pnair@example.com" },
    stage: "final_draft_accepted",
    updates: [
      {
        message: "Final draft submitted for review",
        date: new Date("2025-04-20T13:10:00.000Z"),
      },
      {
        message: "Final draft accepted by supervisor",
        date: new Date("2025-04-25T16:40:00.000Z"),
      },
    ],
  },
];

async function seedProjects() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Uncomment this line if you want to clear existing projects first:
    // await Project.deleteMany({});

    const result = await Project.insertMany(projects);
    console.log(`Inserted ${result.length} projects`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding projects:", err);
    process.exit(1);
  }
}

seedProjects();


