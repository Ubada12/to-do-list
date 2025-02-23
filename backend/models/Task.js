const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  daily: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  category: { type: String }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  dailyTasks: [taskSchema],   // Store tasks where `daily: true`
  completedTasks: [taskSchema], // Store tasks where `completed: true`
  regularTasks: [taskSchema]  // Store tasks where `daily: false`
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
