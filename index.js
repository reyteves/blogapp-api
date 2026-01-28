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
app.use(cors());

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
