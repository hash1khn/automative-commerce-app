// /src/app.js
const express = require('express');
const cors = require('cors');
const morgan=require('morgan');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Other route imports here (productRoutes, orderRoutes, etc.)

const app = express();

app.use(morgan('dev'));


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes)

// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// etc.

module.exports = app;
