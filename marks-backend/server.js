// server.js - Node.js + Express + MongoDB
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGO_URI;
mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ DB error:', err));

// Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  gender: { type: String, enum: ['Male','Female'], required: true },
  department: { type: String, enum: ['IT','CSE','AIDS','CET'], required: true },
  section: { type: Number, enum: [1,2,3], required: true },
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// Routes
// Save student
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: '✅ Student saved', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Save failed' });
  }
});

// List students
app.get('/students', async (req, res) => {
  try {
    const list = await Student.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Fetch failed' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Student Registration API is running' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});