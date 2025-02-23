const User = require('../models/Task'); // Import the User model
const chalk = require('chalk');
const moment = require('moment');

function logRequest(method, statusCode, url, message) {
  let statusMessage = statusCode >= 200 && statusCode < 300 ? 'OK' : 'ERROR';
  let color = statusCode >= 200 && statusCode < 300 ? chalk.green : chalk.red;
  let timestamp = chalk.gray(moment().format('YYYY-MM-DD HH:mm:ss'));

  console.log(`${timestamp} | ${chalk.blue.bold(method)} ${chalk.yellow(url)} ${color(`Processed: ${statusCode} ${statusMessage}`)} - ${chalk.cyan(message)}`);
}

// Create a new task and add it to the appropriate category
const createTask = async (req, res) => {
  try {
    const { email, taskData } = req.body; // Get email and task data from the request

    // Find user by email
    let user = await User.findOne({ email });

    // If user does not exist, create a new user
    if (!user) {
      user = new User({
        email,
        dailyTasks: taskData.daily ? [taskData] : [],
        completedTasks: taskData.completed ? [taskData] : [],
        regularTasks: !taskData.daily && !taskData.completed ? [taskData] : [],
      });

      await user.save();
      logRequest(req.method, 200, req.url, 'New user created and task added');
      return res.status(201).json({ message: "New user created and task added", task: taskData });
    }

    // If user exists, update their task list based on the category
    if (taskData.completed) {
      user.completedTasks.push(taskData);
    } else if (taskData.daily) {
      user.dailyTasks.push(taskData);
    } else {
      user.regularTasks.push(taskData);
    }

    // Save the updated user document
    await user.save();
    res.status(201).json({ message: "Task added successfully", task: taskData });
    logRequest(req.method, 201, req.url, 'Task added');
  } catch (error) {
    res.status(400).json({ message: error.message });
    logRequest(req.method, 400, req.url, error.message);
  }
};

// Get all tasks of a specific category for a user
const getTasks = async (req, res) => {
  try {
    const { email, category } = req.query; // Get email and category from the request query
    const user = await User.findOne({ email });
    // Return tasks based on the category
    if (category === 'daily') {
      logRequest(req.method, 200, req.url, 'Daily tasks fetched');
      return user.dailyTasks;
    } else if (category === 'completed') {
      logRequest(req.method, 200, req.url, 'Completed tasks fetched');
      return user.completedTasks;
    } else if (category === 'regular') {
      logRequest(req.method, 200, req.url, 'Regular tasks fetched');
      return user.regularTasks;
    } else {
      logRequest(req.method, 400, req.url, 'Invalid category');
      return res.status(400).json({ message: "Invalid category" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
    logRequest(req.method, 500, req.url, error.message);
  }
};

// Get a single task by task ID
const getTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task across the user's task categories
    const user = await User.findOne({
      'dailyTasks._id': taskId
    }).or([
      { 'completedTasks._id': taskId },
      { 'regularTasks._id': taskId }
    ]);

    if (!user) {
      logRequest(req.method, 404, req.url, 'Task not found');
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the task in the respective category
    const task = user.dailyTasks.id(taskId) || user.completedTasks.id(taskId) || user.regularTasks.id(taskId);
    res.json(task);
    logRequest(req.method, 200, req.url, 'Task fetched');
  } catch (error) {
    res.status(500).json({ message: error.message });
    logRequest(req.method, 500, req.url, error.message);
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { email, taskData } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logRequest(req.method, 404, req.url, 'User not found');
      return res.status(404).json({ message: "User not found" });
    }
    // Find the task in the respective category
    let task;
    if (taskData.completed) {
      task = user.completedTasks.id(taskId);
    } else if (taskData.daily) {
      task = user.dailyTasks.id(taskId);
    } else {
      task = user.regularTasks.id(taskId);
    }

    // If task not found
    if (!task) {
      logRequest(req.method, 404, req.url, 'Task not found');
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task
    task.set(taskData);// here task is the previus task and taskData is the new task
    await user.save();
    res.json({ message: "Task updated successfully", task });
    logRequest(req.method, 200, req.url, 'Task updated');
  } catch (error) {
    res.status(500).json({ message: error.message });
    logRequest(req.method, 500, req.url, error.message);
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { email } = req.body; // Get email of the user

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logRequest(req.method, 404, req.url, 'User not found');
      return res.status(404).json({ message: "User not found" });
    }

    // Find and delete the task from the respective category
    let taskDeleted = false;

    // Check if task exists in dailyTasks, regularTasks, or completedTasks and remove it
    ['dailyTasks', 'regularTasks', 'completedTasks'].forEach(category => {
      const taskIndex = user[category].findIndex(task => task._id.toString() === taskId);
      if (taskIndex !== -1) {
        user[category].splice(taskIndex, 1);  // Removes the task from the array
        taskDeleted = true;
      }
    });

    if (!taskDeleted) {
      logRequest(req.method, 404, req.url, 'Task not found');
      return res.status(404).json({ message: "Task not found" });
    }

    await user.save();
    res.json({ message: "Task deleted successfully" });
    logRequest(req.method, 200, req.url, 'Task deleted');

  } catch (error) {
    res.status(500).json({ message: error.message });
    logRequest(req.method, 500, req.url, error.message);
  }
};


module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
