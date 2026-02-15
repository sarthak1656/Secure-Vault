import 'dotenv/config';
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { initGridFS } from "./src/config/gridfs.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    const connection = await connectDB();
    console.log("MongoDB connected successfully");

    // Initialize GridFS
    console.log("Initializing GridFS...");
    initGridFS(connection);
    console.log("GridFS initialized successfully");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
