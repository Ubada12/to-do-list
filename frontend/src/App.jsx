import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from './components/navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import TodoList from './pages/ToDoList';
import Footer from './components/footer'; // Make sure the path is correct
import { Box } from '@mui/material';
import BouncingDots from './components/LoadingAnimation';
// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <BouncingDots />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {

  return (
    <BrowserRouter>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',  // full viewport height
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{
            flex: 1,  // takes up available space
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Routes>
            {/* Public route */}
            <Route path="/" element={
                <Home />
              } />
            
            {/* Protected routes */}
            <Route 
              path="/todo-list"
              element={
                <ProtectedRoute>
                  <TodoList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
