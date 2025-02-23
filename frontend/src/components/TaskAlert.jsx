import React from "react";
import { Snackbar, Alert, Button } from "@mui/material";
import { motion } from "framer-motion";

const TaskAlert = ({ showAlert, setShowAlert, text, showUndo, onUndo }) => {
  const handleClose = () => {
    setShowAlert(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Snackbar
        open={showAlert}
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px", // Add spacing between text and button
            backgroundColor: "#4CAF50",
            color: "white",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            minWidth: "250px", // Prevent too much shrinking on mobile
            maxWidth: "600px", // Prevent too much expansion
            flexWrap: "nowrap", // Prevent button from moving to next line
            whiteSpace: "nowrap", // Prevent text breaking into multiple lines
          }}
        >
          <span style={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
            {text}
          </span>
          {showUndo && (
            <Button
              color="inherit"
              size="small"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                border: "1px solid white",
                padding: "3px 10px",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
                marginLeft: "10px", // Add spacing between button and text
              }}
              onClick={() => {
                if (onUndo) onUndo();
                handleClose();
              }}
            >
              Undo
            </Button>
          )}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default TaskAlert;

