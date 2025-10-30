<<<<<<< HEAD
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")

// Import routes
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/posts")
const userRoutes = require("./routes/users")
const uploadRoutes = require("./routes/upload")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log("Created uploads directory:", uploadsDir)
}

// CORS configuration - MUST be before other middleware
=======
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const serverless = require("serverless-http");

// Import routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/upload");

dotenv.config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory:", uploadsDir);
}

// CORS configuration
>>>>>>> 74b3f2e9c585322352dc4ba1edf1e01dfbbeace2
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
<<<<<<< HEAD
  }),
)

// Handle preflight requests
app.options("*", cors())

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir))
console.log("Serving static files from:", uploadsDir)

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  if (req.headers.authorization) {
    console.log("Authorization header present")
  }
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/users", userRoutes)
app.use("/api/upload", uploadRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message)
  console.error("Stack:", err.stack)
  res.status(500).json({ error: err.message || "Something went wrong" })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API URL: http://localhost:${PORT}/api`)
  console.log(`Uploads URL: http://localhost:${PORT}/uploads`)
})
=======
  })
);
app.options("*", cors());

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static(uploadsDir));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.message);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


module.exports = app;
module.exports.handler = serverless(app);
>>>>>>> 74b3f2e9c585322352dc4ba1edf1e01dfbbeace2
