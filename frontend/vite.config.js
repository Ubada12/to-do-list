import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";

// Ensure your certificates are in the right directory
const certPath = path.resolve(__dirname, './cert.crt');
const keyPath = path.resolve(__dirname, './cert.key');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist', // Make sure this is correctly set
  },
  server: {
    https: {
      key: fs.readFileSync(keyPath), // Path to the private key
      cert: fs.readFileSync(certPath), // Path to the certificate
    },
    host: "0.0.0.0", // Optional: allows external access (e.g., mobile devices)
    port: 3000, // You can change the port if needed
  },
});
