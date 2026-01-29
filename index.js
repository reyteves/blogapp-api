const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - More permissive for development
// For production, consider restricting to specific origins
app.use(cors({
  origin: true, // Allows any origin (development only)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Alternative: Completely disable CORS (NOT RECOMMENDED for production)
// app.use(cors({ origin: '*' }));

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => console.log('Connected to MongoDB'));

// Route Mounting
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`API is now online on port ${port}`);
});
