// /src/app.js
const express = require('express');
const cors = require('cors');
const morgan=require('morgan');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes=require('./routes/cartRoutes');
const orderRoutes=require('./routes/orderRoutes');


const app = express();

app.use(morgan('dev'));


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handles form-data


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes)
app.use('/api/products', productRoutes);
app.use('/api/cart',cartRoutes)
app.use('/api/orders',orderRoutes)

module.exports = app;
