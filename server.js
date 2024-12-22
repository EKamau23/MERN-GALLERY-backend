const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const connectDB = require('./config/db'); // Import the MongoDB connection logic
const winston = require('winston');

// Ensure database connection happens once at the start
connectDB(); // Establish MongoDB connection before server starts

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' })); // Handle large JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Handle large URL-encoded payloads

// CORS configuration: allow frontend to access backend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://mern-gallery-frontend.onrender.com'
}));


// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));                // Authentication routes
app.use('/api/admin', require('./routes/adminRoutes'));              // Admin routes
app.use('/api/admin', require('./routes/adminSetupRoutes'));         // Admin setup routes
app.use('/api/gallery', require('./routes/galleryRoutes'));          // Gallery routes
app.use('/api/photos', require('./routes/photoRoutes'));             // Photo routes
app.use('/api/user', require('./routes/userRoutes'));                // User routes

// Initialize Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors
    new winston.transports.File({ filename: 'combined.log' }),              // Log all logs
  ],
});

// Log to console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
