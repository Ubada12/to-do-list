const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const chalk = require('chalk');
const moment = require('moment');

function logRequest(method, statusCode, url, message) {
  let statusMessage = statusCode >= 200 && statusCode < 300 ? 'OK' : 'ERROR';
  let color = statusCode >= 200 && statusCode < 300 ? chalk.green : chalk.red;
  let timestamp = chalk.gray(moment().format('YYYY-MM-DD HH:mm:ss'));

  console.log(`${timestamp} | ${chalk.blue.bold(method)} ${chalk.yellow(url)} ${color(`Processed: ${statusCode} ${statusMessage}`)} - ${chalk.cyan(message)}`);
}

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  logRequest(req.method, 200, req.url, 'Task Manager API is Running...');
  res.send('Task Manager API is Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
