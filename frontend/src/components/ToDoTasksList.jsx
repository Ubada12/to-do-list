import React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton, TextField
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth0 } from "@auth0/auth0-react";
import { keyframes } from '@emotion/react';
import SaveIcon from "@mui/icons-material/Save";
import TaskAlert from './TaskAlert';  // Import TaskAlert component

async function updateTask(email, task){
  try {
    console.log('Updating task:', task._id);
    const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, taskData: task }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Task updated:', data);
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

async function createTask(email, task){
  try {
    task.completed= true;
    console.log('Creating task:', task);
    const response = await fetch('http://localhost:5000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, taskData: task }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Task created:', data);
  } catch (error) {
    console.error('Error creating task:', error);
  }
}

async function DeleteTask(email, task){
  try {
    console.log('Deleting task:', task);
    const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Task deleted:', data);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

function areObjectsDifferent(obj1, obj2) {
  const excludedKeys = ["completed", "createdAt", "daily", "updatedAt", "_id"];
  
  for (const key in obj1) {
      if (excludedKeys.includes(key)) {
          continue; // Skip excluded keys
      }

      // Validation checks for obj2
      if (key === "category" && (obj2[key] === null || obj2[key] === undefined)) {
          return true; // category cannot be null or undefined
      }
      if (key === "description" && (!obj2[key] || obj2[key].trim() === "")) {
          return true; // description cannot be empty
      }
      if (key === "title" && (!obj2[key] || obj2[key].trim() === "")) {
          return true; // title cannot be empty
      }
      if (key === "priority" && !["Medium", "High", "Low"].includes(obj2[key])) {
          return true; // priority must be Medium, High, or Low
      }

      // Compare values
      if (obj1[key] !== obj2[key]) {
          return true; // Return true as soon as a difference is found
      }
  }
  return false; // Return false if no differences are found
}

// Define animations
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const TaskList = ({ changesDetected }) => {
  const { user } = useAuth0();
  const [alertText, setAlertText] = useState('');      // State to control alert message
  const [showAlert, setShowAlert] = useState(false);  // State to control alert visibility
  const [dailyTasks, setDailyTasks] = useState([]);
  const [regularTasks, setRegularTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [undoTask, setUndoTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState(null);

  const handleEditClick = (task) => {
    setEditingTaskId(task._id); // Set task to be edited
    setEditedTask(task); // Pre-fill the fields with the task data
  };

  const handleSaveClick = async (task) => {
    // Save the edited task (replace this logic with an actual state update if needed)
    // You would typically send the updated task back to the parent component or database here.
    console.log('Before saving task:', task);
    console.log('Saving task:', editedTask);
    if(areObjectsDifferent(task, editedTask))
    {
      await updateTask(user.email, editedTask);
      console.log('Task saved!');
      (editedTask.daily === true) ? await fetchTasks('daily', setDailyTasks) : await fetchTasks('regular', setRegularTasks);
    }
    else
    {
      console.log('No changes detected or validation issue');
    }
    
    setEditingTaskId(null); // Exit editing mode
  };

  const fetchTasks = async (category, setState) => {
    try {
      if (!user || !user.email) {
        console.warn(`Skipping fetch for ${category}, user email is missing`);
        return;
      }
  
      console.log(`Fetching ${category} tasks...`);
      
      const response = await fetch(
        `http://localhost:5000/api/tasks/?email=${user.email}&category=${category}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(`${category} tasks received:`, data);
  
      setState(data);
    } catch (error) {
      console.error(`Error fetching ${category} tasks:`, error);
    }
  };
  
  useEffect(() => {
    if (user?.email) {
      console.log("User changed, fetching tasks...");
      fetchTasks('daily', setDailyTasks);
      fetchTasks('regular', setRegularTasks);
      fetchTasks('completed', setCompletedTasks);
    }
  }, [user?.email, changesDetected]); // Use `user.email` instead of `user` to avoid infinite loop  

  const handleCompleteIconClick = async (task) => {
    console.log('Complete icon clicked!', task);
    setAlertText(`Task "${task.title}" completed!`);
    setShowAlert(true);  // Show alert when the icon is clicked
    setTimeout(async () => {
      console.log('Alert timeout!');
      if (!undoTask) {
        setUndoTask(false);
        console.log('Task completed!');
        await DeleteTask(user.email, task);
        await createTask(user.email, task);
        await fetchTasks('daily', setDailyTasks);
        await fetchTasks('regular', setRegularTasks);
        await fetchTasks('completed', setCompletedTasks);
      }
    }, 8000);
  }

  const handleDeleteIconClick = async (task) => {
    console.log('Delete icon clicked!', task);
    setAlertText(`Task "${task.title}" deleted!`);
    setShowAlert(true);  // Show alert when the icon is clicke
    setTimeout(async () => {
      console.log('Alert timeout!');
      if (!undoTask) {
        setUndoTask(false);
        console.log('Task  Deleted!!');
        await DeleteTask(user.email, task);
        await fetchTasks('daily', setDailyTasks);
        await fetchTasks('regular', setRegularTasks);
        await fetchTasks('completed', setCompletedTasks);
      }
    }, 8000);
  }

  const handleUndo = () => {
    console.log('Undo clicked!');
    setUndoTask(true);
  }

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3 },
        maxWidth: "1200px",
        margin: "20px auto"
      }}
    >
      <Grid container spacing={3}>
        {/* Not Completed Tasks Column */}
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            whileHover={{ 
              scale: 1.01,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)' 
            }}
            transition={{ type: "spring", stiffness: 300 }}
            sx={{
              height: '100%',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: 'primary.main'
                }}
              >
                Tasks To Complete
              </Typography>

              {/* Daily Tasks Section */}
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary'
                }}
              >
                <AutorenewIcon /> Daily Tasks
              </Typography>
              <List>
                {dailyTasks.length === 0 ? (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      mt: 4, 
                      color: 'gray', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center'
                    }}
                  >
                    <PlaylistAddCheckCircleIcon 
                      sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} 
                    />
                    <Typography variant="h5" fontWeight="bold">
                      No tasks yet!
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, maxWidth: 300 }}>
                      Stay productive! Start by adding a new task and take control of your day.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ mt: 2, borderRadius: 3, px: 4 }}
                      startIcon={<AddTaskIcon />}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth', // Optional: adds smooth scrolling
                        });
                      }}
                    >
                      Add Your First Task
                    </Button>
                  </Box>
              ) : (
                dailyTasks.map((task) => (
                  <ListItem
                      sx={{
                        bgcolor: (theme) => theme.palette.background.paper, // Use theme's paper color
                        mb: 3,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'translateX(5px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      secondaryAction={
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            animation: `${fadeIn} 1s ease-in`, // Fade-in effect when the component is rendered
                          }}
                        >
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => {
                              if (editingTaskId === task._id) {
                                handleSaveClick(task); // Save when clicking "Save"
                              } else {
                                console.log(task._id);
                                handleEditClick(task); // Start editing when clicking "Edit"
                              }
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(0, 123, 255, 0.1)', // Light blue hover effect
                                transform: 'scale(1.1) rotate(15deg)', // Slight scale-up and rotation effect
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                              },
                              padding: 1,
                              animation: `${pulse} 2s infinite`, // Pulse animation on hover
                            }}
                          >
                            {editingTaskId === task.id ? <SaveIcon color="primary" /> : <EditIcon color="primary" />}
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="complete"
                            onClick={() => handleCompleteIconClick(task)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.1)', // Light green hover effect
                                transform: 'scale(1.1) rotate(-15deg)', // Slight scale-up and reverse rotation effect
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                              },
                              padding: 1,
                              animation: `${pulse} 2s infinite`, // Pulse animation on hover
                            }}
                          >
                            <CheckCircleOutlineIcon color="success" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteIconClick(task)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)', // Light red hover effect
                                transform: 'scale(1.1) rotate(15deg)', // Slight scale-up and rotation effect
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                              },
                              padding: 1,
                              animation: `${pulse} 2s infinite`, // Pulse animation on hover
                            }}
                          >
                            <DeleteOutlineIcon color="error" />
                          </IconButton>
                        </Box>
                      }
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10, // Position it just above the ListItem
                          left: -10, // Align to the left corner
                          backgroundColor: 'primary.main', // Background color for the label
                          color: 'white', // Text color for the label
                          padding: '4px 8px', // Padding for the label
                          borderRadius: '12px', // Rounded corners for the label
                          fontSize: '0.75rem', // Smaller font size for the label
                          fontWeight: 'bold', // Make it bold
                          display: 'flex', // Use flexbox to center the textfield
                          justifyContent: 'center', // Horizontally center
                          alignItems: 'center', // Vertically center
                          width: 'auto', // Let the Box shrink to fit content
                          maxWidth: 'calc(100% - 20px)', // Adjust to prevent overflow
                        }}
                      >
                        {editingTaskId === task._id ? (
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Category"
                            value={editedTask.category}
                            onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                            sx={{
                              marginTop: 2,
                              marginBottom: 1,
                              maxWidth: '150px', // Set a smaller width for the TextField
                              height: '32px', // Match the height of the Box
                              fontSize: '0.75rem', // Reduce font size
                              '& .MuiInputBase-root': {
                                padding: '0 8px', // Reduce horizontal padding
                                height: '32px', // Ensure the height is 32px
                                borderRadius: '8px', // Rounded corners for input
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.75rem', // Reduce font size of label
                                color: '#f5f5f5', // Lighter color for label to stand out
                              },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#fff', // Light border color
                                },
                                '&:hover fieldset': {
                                  borderColor: '#80b3ff', // Light blue hover effect
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#80b3ff', // Blue focus effect
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '6px 8px', // Adjust padding to fit within the height
                                color: '#f5f5f5', // Light input text color for contrast
                              },
                            }}
                          />
                        ) : (
                          task.category
                        )}
                      </Box>
                      <AnimatePresence mode="wait">
                      {editingTaskId === task._id ? (
                        <motion.div
                          key="editMode"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Title"
                              value={editedTask.title}
                              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                              sx={{ marginTop: 8, marginBottom: 2, maxWidth: 'calc(100% - 100px)' }}
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Description"
                              value={editedTask.description}
                              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                              sx={{ marginTop: 2, marginBottom: 2, maxWidth: 'calc(100% - 100px)' }}
                            />
                          </Box>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="viewMode"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "calc(100% - 100px)",
                            padding: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              flex: "0 0 90%", // Takes 70% of the available space
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "normal", // Ensures wrapping
                            }}
                          >
                            <p
                              style={{
                                fontSize: "1rem",
                                fontWeight: "bold",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                margin: 0,
                                whiteSpace: "normal", // Allows text to wrap
                              }}
                            >
                              {task.title}
                            </p>
                            <span
                              style={{
                                fontSize: "0.9rem",
                                color: "gray",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal", // Ensures description wraps properly
                              }}
                            >
                              {task.description}
                            </span>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    </ListItem>
                ))
              )}
              </List>

              <Divider sx={{ my: 3 }} />

              {/* Regular Tasks Section */}
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary'
                }}
              >
                <TaskAltIcon /> Regular Tasks
              </Typography>
              <List>
                {regularTasks.length === 0 ? (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      mt: 4, 
                      color: 'gray', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center'
                    }}
                  >
                    <PlaylistAddCheckCircleIcon 
                      sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} 
                    />
                    <Typography variant="h5" fontWeight="bold">
                      No tasks yet!
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, maxWidth: 300 }}>
                      Stay productive! Start by adding a new task and take control of your day.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ mt: 2, borderRadius: 3, px: 4 }}
                      startIcon={<AddTaskIcon />}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth', // Optional: adds smooth scrolling
                        });
                      }}
                    >
                      Add Your First Task
                    </Button>
                  </Box>
              ) : (
                regularTasks
                .sort((a, b) => {
                  // Define priority order: High > Medium > Low
                  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                  
                  // Compare tasks based on their priority value
                  return priorityOrder[b.priority] - priorityOrder[a.priority]; // Sorting in descending order
                })
                .map((task) => (
                  <ListItem
                      sx={{
                        bgcolor: (theme) => {
                          switch (task.priority) {
                            case 'High':
                              return '#ffcccc'; // Very light red for high priority (pleasant contrast)
                            case 'Medium':
                              return '#fef2d7'; // Very light, soft yellow for medium priority
                            case 'Low':
                              return '#d4f7d2'; // Very light green for low priority
                            default:
                              return theme.palette.background.paper; // Default background if no priority
                          }
                        },
                        mb: 3,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'translateX(5px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      secondaryAction={
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            animation: `${fadeIn} 1s ease-in`, // Fade-in effect when the component is rendered
                          }}
                        >
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => {
                              if (editingTaskId === task._id) {
                                handleSaveClick(task); // Save when clicking "Save"
                              } else {
                                handleEditClick(task); // Start editing when clicking "Edit"
                              }
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(0, 123, 255, 0.1)', // Light blue hover effect
                                transform: 'scale(1.1) rotate(15deg)', // Slight scale-up and rotation effect
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                              },
                              padding: 1,
                              animation: `${pulse} 2s infinite`, // Pulse animation on hover
                            }}
                          >
                            {editingTaskId === task._id ? <SaveIcon color="primary" /> : <EditIcon color="primary" />}
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="complete"
                            onClick={() => handleCompleteIconClick(task)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.1)', // Light green hover effect
                                transform: 'scale(1.1) rotate(-15deg)', // Slight scale-up and reverse rotation effect
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                              },
                              padding: 1,
                              animation: `${pulse} 2s infinite`, // Pulse animation on hover
                            }}
                          >
                            <CheckCircleOutlineIcon color="success" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteIconClick(task)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)', // Light red hover effect
                                transform: 'scale(1.1) rotate(15deg)', // Slight scale-up and rotation effect
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                              },
                              padding: 1,
                              animation: `${pulse} 2s infinite`, // Pulse animation on hover
                            }}
                          >
                            <DeleteOutlineIcon color="error" />
                          </IconButton>
                        </Box>
                      }
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10, // Position it just above the ListItem
                          left: -10, // Align to the left corner
                          backgroundColor: 'primary.main', // Background color for the label
                          color: 'white', // Text color for the label
                          padding: '4px 8px', // Padding for the label
                          borderRadius: '12px', // Rounded corners for the label
                          fontSize: '0.75rem', // Smaller font size for the label
                          fontWeight: 'bold', // Make it bold
                          display: 'flex', // Use flexbox to center the textfield
                          justifyContent: 'center', // Horizontally center
                          alignItems: 'center', // Vertically center
                          width: 'auto', // Let the Box shrink to fit content
                          maxWidth: 'calc(100% - 20px)', // Adjust to prevent overflow
                        }}
                      >
                        {editingTaskId === task._id ? (
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Category"
                            value={editedTask.category}
                            onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                            sx={{
                              marginTop: 2,
                              marginBottom: 1,
                              maxWidth: '150px', // Set a smaller width for the TextField
                              height: '32px', // Match the height of the Box
                              fontSize: '0.75rem', // Reduce font size
                              '& .MuiInputBase-root': {
                                padding: '0 8px', // Reduce horizontal padding
                                height: '32px', // Ensure the height is 32px
                                borderRadius: '8px', // Rounded corners for input
                              },
                              '& .MuiInputLabel-root': {
                                fontSize: '0.75rem', // Reduce font size of label
                                color: '#f5f5f5', // Lighter color for label to stand out
                              },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: '#fff', // Light border color
                                },
                                '&:hover fieldset': {
                                  borderColor: '#80b3ff', // Light blue hover effect
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#80b3ff', // Blue focus effect
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '6px 8px', // Adjust padding to fit within the height
                                color: '#f5f5f5', // Light input text color for contrast
                              },
                            }}
                          />
                        ) : (
                          task.category
                        )}
                      </Box>

                    <AnimatePresence mode="wait">
                      {editingTaskId === task._id ? (
                        <motion.div
                          key="editMode"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Title"
                              value={editedTask.title}
                              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                              sx={{ marginTop: 8, marginBottom: 2, maxWidth: 'calc(100% - 100px)' }}
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Description"
                              value={editedTask.description}
                              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                              sx={{ marginTop: 2, marginBottom: 2, maxWidth: 'calc(100% - 100px)' }}
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Priority"
                              value={editedTask.priority}
                              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                              sx={{ marginTop: 2, marginBottom: 2, maxWidth: 'calc(100% - 100px)' }}
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              type="date"
                              label="Deadline"
                              value={editedTask.deadline}
                              onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                              InputLabelProps={{ shrink: true }} // Fixes label overlapping
                              sx={{ marginTop: 2, marginBottom: 2, maxWidth: 'calc(100% - 100px)' }}
                            />
                          </Box>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="viewMode"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: "calc(100% - 100px)",
                            padding: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              flex: "0 0 90%", // Takes 70% of the available space
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "normal", // Ensures wrapping
                            }}
                          >
                            <p
                              style={{
                                fontSize: "1rem",
                                fontWeight: "bold",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                margin: 0,
                                whiteSpace: "normal", // Allows text to wrap
                              }}
                            >
                              {task.title}
                            </p>
                            <span
                              style={{
                                fontSize: "0.9rem",
                                color: "gray",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal", // Ensures description wraps properly
                              }}
                            >
                              {task.description}
                            </span>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItem>
                ))
              )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed Tasks Column */}
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            whileHover={{ 
              scale: 1.01,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)' 
            }}
            transition={{ type: "spring", stiffness: 300 }}
            sx={{
              height: '100%',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: 'success.main'
                }}
              >
                Completed Tasks
              </Typography>
              <List>
              {completedTasks.length === 0 ? (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      mt: 4, 
                      color: 'gray', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center'
                    }}
                  >
                    <PlaylistAddCheckCircleIcon 
                      sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} 
                    />
                    <Typography variant="h5" fontWeight="bold">
                      No completed tasks yet!
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, maxWidth: 300 }}>
                      Stay productive! Start by adding a new task and take control of your day.
                    </Typography>
                  </Box>
              ) : (
                completedTasks
                .sort((a, b) => {
                  // Define priority order: High > Medium > Low
                  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                  
                  // Compare tasks based on their priority value
                  return priorityOrder[b.priority] - priorityOrder[a.priority]; // Sorting in descending order
                })
                .map((task) => (
                  <ListItem
                      sx={{
                        bgcolor: (theme) => {
                          switch (task.priority) {
                            case 'High':
                              return '#ffcccc'; // Very light red for high priority (pleasant contrast)
                            case 'Medium':
                              return '#fef2d7'; // Very light, soft yellow for medium priority
                            case 'Low':
                              return '#d4f7d2'; // Very light green for low priority
                            default:
                              return theme.palette.background.paper; // Default background if no priority
                          }
                        },
                        mb: 3,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'translateX(5px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      secondaryAction={
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            animation: `${fadeIn} 1s ease-in`, // Fade-in effect when the component is rendered
                          }}
                        >
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteIconClick(task)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)', // Light red hover effect
                                transform: 'scale(1.1) rotate(15deg)', // Slight scale-up and rotation effect
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                              },
                              padding: 1,
                              animation: `${pulse} 2s infinite`, // Pulse animation on hover
                            }}
                          >
                            <DeleteOutlineIcon color="error" />
                          </IconButton>
                        </Box>
                      }
                    >
                      {/* Top-left corner category label */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10, // Position it just above the ListItem
                          left: -10, // Align to the left corner
                          backgroundColor: 'primary.main', // Background color for the label
                          color: 'white', // Text color for the label
                          padding: '4px 8px', // Padding for the label
                          borderRadius: '12px', // Rounded corners for the label
                          fontSize: '0.75rem', // Smaller font size for the label
                          fontWeight: 'bold', // Make it bold
                        }}
                      >
                        {task.category}
                      </Box>
                      <motion.div
                        key="viewMode"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          maxWidth: "calc(100% - 100px)",
                          padding: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            flex: "0 0 100%", // Takes 70% of the available space
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal", // Ensures wrapping
                          }}
                        >
                          <ListItemText 
                            primaryTypographyProps={{ sx: { marginBottom: 1 } }} // Adds spacing
                            primary={<Typography sx={{ textDecoration: 'line-through', wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>{task.title}</Typography>}
                            secondary={
                            <Typography sx={{ fontSize: "0.9rem", color: "gray", wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                              {task.description}
                            </Typography>
                          }
                        />
                      </Box>
                    </motion.div>
                  </ListItem>
                ))
              )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <TaskAlert
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        text={alertText}
        showUndo={true} // Set false if you don't want to show undo
        onUndo={handleUndo}
      />
    </Box>
  );
};

export default TaskList;
