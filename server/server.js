const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Routes
const projectRoutes = require('./routes/projectRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const facultyRoutes = require('./routes/facultyRoutes.js');

const app = express();
const PORT = process.env.PORT || 1532; 

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/faculty', facultyRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});