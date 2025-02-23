const express = require('express');
const User = require('../models/Task'); // Import the User model
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();
const chalk = require('chalk');
const moment = require('moment');

function logRequest(method, statusCode, url, message) {
  let statusMessage = statusCode >= 200 && statusCode < 300 ? 'OK' : 'ERROR';
  let color = statusCode >= 200 && statusCode < 300 ? chalk.green : chalk.red;
  let timestamp = chalk.gray(moment().format('YYYY-MM-DD HH:mm:ss'));

  console.log(`${timestamp} | ${chalk.blue.bold(method)} ${chalk.yellow(url)} ${color(`Processed: ${statusCode} ${statusMessage}`)} - ${chalk.cyan(message)}`);
}

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { email, taskData } = req.body;
    if (!email || !taskData) {
      logRequest(req.method, 400, req.url, 'Email and task data are required.');
      return res.status(400).json({ message: 'Email and task data are required.' });
    }
    await createTask(req, res);
  } catch (error) {
    logRequest(req.method, 500, req.url, error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/send-email", async (req, res) => {
  try {
      const API_URL = "https://control.msg91.com/api/v5/email/send";
      const AUTH_KEY = "430408AauBUa3u8V66e935d0P1";

      const response = await fetch(API_URL, {
          method: "POST",
          headers: {
              "authkey": AUTH_KEY,
              "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.status(response.status).json(data);
      logRequest(req.method, response.status, req.url, "Email sent successfully.");
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      logRequest(req.method, 500, req.url, error.message);
  }
});

router.get('/', async (req, res) => {
  try {
      const { email, category } = req.query;

      // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logRequest(req.method, 404, req.url, 'User not found');
      return res.status(404).json({ message: "User not found" });
    }

      // Check if email is provided
      if (!email) {
          logRequest(req.method, 400, req.url, 'Email is required to fetch tasks.');
          return res.status(400).json({ message: 'Email is required to fetch tasks.' }); // Return to prevent further execution
      }
  
      // Validate the category
      const validCategories = ['daily', 'completed', 'regular'];
      if (category && !validCategories.includes(category)) {
          logRequest(req.method, 400, req.url, 'Invalid category.');
          return res.status(400).json({ message: 'Invalid category. Valid categories are daily, completed, or regular.' }); // Return to prevent further execution
      }
  
      const task = await getTasks(req, res);
      return res.status(200).json(task);
  } catch (error) {
      logRequest(req.method, 500, req.url, error.message);
      return res.status(500).json({ message: error.message }); // Ensure return to prevent duplicate responses
  }
});

  

// Get a single task by ID and category
router.get('/:id', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      logRequest(req.method, 400, req.url, 'Email is required to fetch a task.');
      return res.status(400).json({ message: 'Email is required to fetch a task.' });
    }
    const task = await getTask(req, res);
    res.status(201).json(task);
  } catch (error) {
    logRequest(req.method, 500, req.url, error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', updateTask);  // No need for changes since `updateTask` already handles user-specific logic

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      logRequest(req.method, 400, req.url, 'Email is required to delete a task.');
      return res.status(400).json({ message: 'Email is required to delete a task.' });
    }
    await deleteTask(req, res);  // Adjusted to work with user-specific task deletion logic
  } catch (error) {
    logRequest(req.method, 500, req.url, error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

