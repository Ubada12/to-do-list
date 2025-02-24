import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import TaskAlert from './TaskAlert';  // Import TaskAlert component
import { 
  TextField, 
  MenuItem, 
  FormControl, 
  Select, 
  InputLabel, 
  FormControlLabel, 
  Switch, 
  Button, 
  Card, 
  CardContent, 
  Typography,
  Box
} from "@mui/material";
import { motion } from "framer-motion";
import AddTaskIcon from '@mui/icons-material/AddTask';

const categories = ["Work", "Personal", "Health", "Study", "Other"];
const priorities = ["High", "Medium", "Low"];

const ToDoForm = ({ onChangesDetected }) => {
  const [changesDetected, setChangesDetected] = useState(false);
  const [showAlert, setShowAlert] = useState(false);  // State to control alert visibility
  const [alertText, setAlertText] = useState('');      // State to control alert message
  const { user } = useAuth0();
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "",
    deadline: "",
    priority: "Medium",
    daily: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
  
    // Ensure task completion flag is set
    task.completed = false;
    console.log("Task data:", task);
    try {
      const response = await fetch("https://to-do-list-backend-hazel.vercel.app/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, taskData: task }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add task"); // Handle failed request
      }
  
      // If request was successful
      setAlertText("Task added successfully!");
      setShowAlert(true);
      setChangesDetected(true);  // Track that changes were detected
      onChangesDetected(prev => !prev);  // Notify the parent component
      
  
      // Reset the form
      setTask({
        title: "",
        description: "",
        category: "",
        deadline: "",
        priority: "Medium",
        daily: false,
      });
  
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };  

  const handleToggle = () => {
    setTask((prev) => ({ 
      ...prev, 
      daily: !prev.daily, 
      priority: "Medium", 
      deadline: "" 
    }));
  };

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ 
        padding: { xs: 2, sm: 3 },
        maxWidth: "600px",
        margin: "20px auto"
      }}
    >
      <Card 
        elevation={6}
        component={motion.div}
        whileHover={{ 
          scale: 1.01,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.4)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)' 
        }}
        transition={{ type: "spring", stiffness: 300 }}
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component={motion.h4}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            sx={{
              mb: 5,
              textAlign: "center",
              fontWeight: "700",
              color: "primary.main",
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Create a Task
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmission}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              '& .form-group-1': {
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mb: 4
              },
              '& .form-group-2': {
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mb: 4
              }
            }}
          >
            <div className="form-group-1">
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={task.title}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease-in-out',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={task.description}
                onChange={handleChange}
                required
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease-in-out',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    },
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={task.category}
                  onChange={handleChange}
                  label="Category"
                  required
                  sx={{
                    transition: 'all 0.3s ease-in-out',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    },
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="form-group-2">
              <FormControl 
                fullWidth 
                disabled={task.daily}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    '& legend': {
                      marginLeft: '5px',
                      '& span': {
                        paddingLeft: '5px',
                        paddingRight: '5px',
                      }
                    }
                  }
                }}
              >
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  label="Priority"
                  sx={{
                    transition: 'all 0.3s ease-in-out',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    },
                  }}
                >
                  {priorities.map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Deadline"
                name="deadline"
                value={task.deadline}
                onChange={handleChange}
                disabled={task.daily}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease-in-out',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    },
                  },
                }}
              />
            </div>

            <FormControlLabel
              control={
                <Switch 
                  checked={task.daily} 
                  onChange={handleToggle} 
                  color="primary" 
                />
              }
              label="Daily Task"
              sx={{
                mb: 2,
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'primary.main',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'primary.main',
                },
              }}
            />
            
            <Button
            component={motion.button} // ✅ Framer Motion applied to Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }} // ✅ Moved from motion.div to Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit" // ✅ Now works properly
            startIcon={<AddTaskIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,118,255,0.23)',
                background: 'primary.dark'
              },
            }}
          >
            Add Task
          </Button>

         </Box>
        </CardContent>
      </Card>
      {/* TaskAlert is rendered here based on state */}
      <TaskAlert showAlert={showAlert} setShowAlert={setShowAlert} text={alertText} showUndo={false}/>
    </Box>
  );
};

export default ToDoForm;
