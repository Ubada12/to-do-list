import React, { useEffect, useRef } from 'react';

const LoadingAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set the canvas size to match the window dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(30, -30);  // Reduce the scale factor for a smaller butterfly

    // Set an array of colors to cycle through
    const colors = ["red", "green", "blue", "yellow", "purple", "orange"];
    let colorIndex = 0;  // Initial color index
    let theta = 0;  // Start angle

    const durationPerIteration = 2000;  // Duration per drawing iteration in milliseconds
    let startTime = null;

    const drawButterfly = (timestamp) => {
      if (!startTime) startTime = timestamp; // Set the start time for the first frame
      const elapsedTime = timestamp - startTime;  // Calculate elapsed time in ms

      // Calculate how much theta should increase based on elapsed time
      const thetaIncrement = (elapsedTime / durationPerIteration) * (2 * Math.PI);

      // Clear canvas to create animation effect
      ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.fillStyle = "black";  // Set the background again to avoid clearing the canvas to white

      ctx.beginPath();
      for (let i = 0; i < theta + thetaIncrement; i += 0.01) {
        let r = Math.exp(Math.cos(i)) - 2 * Math.cos(4 * i) - Math.pow(Math.sin(i / 12), 5);

        // Anti-clockwise rotation to face upwards
        let x = -r * Math.sin(i);  // Rotate counterclockwise (anti-clockwise)
        let y = r * Math.cos(i);   // Keep the 'y' positive for upward orientation

        ctx.lineTo(x, y);
      }

      // Change color after completing a drawing
      ctx.strokeStyle = colors[colorIndex];
      ctx.lineWidth = 0.02;
      ctx.stroke();

      // Check if we have completed one iteration (2 seconds)
      if (elapsedTime >= durationPerIteration) {
        // Reset for the next iteration
        theta += thetaIncrement;  // Move to the next iteration of the shape
        colorIndex = (colorIndex + 1) % colors.length;  // Cycle through colors
        startTime = null;  // Reset start time for the next cycle
      }

      // Continue drawing step by step
      requestAnimationFrame(drawButterfly);  // Keep calling the function to animate
    };

    // Start drawing
    requestAnimationFrame(drawButterfly);

    // Cleanup on unmount to stop the animation
    return () => {
      cancelAnimationFrame(drawButterfly);
    };
  }, []);

  return (
    <div style={{ margin: 0, overflow: 'hidden', background: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default LoadingAnimation;
