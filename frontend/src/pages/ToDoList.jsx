import React from 'react';
import { Box } from '@mui/material';
import ToDoForm from '../components/ToDoForm';
import ToDoTasksList from '../components/ToDoTasksList';

const TodoList = () => {
  const [changesDetected, setChangesDetected] = React.useState(false);

  // Function to update changesDetected from ToDoForm
  const handleChangesDetected = (newChangesDetected) => {
    setChangesDetected(newChangesDetected);
    console.log(changesDetected);
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to left, #e6e6fa, #add8e6)',
        padding: { xs: 2, sm: 4 },
        // Add smooth transition for any theme changes
        transition: 'background 0.3s ease-in-out'
      }}
    >
      <ToDoForm onChangesDetected={handleChangesDetected} />
      <ToDoTasksList changesDetected={changesDetected} />
    </Box>
  );
};

export default TodoList;