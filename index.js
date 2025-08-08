const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// Load environment variables
dotEnv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Debug startup
console.log('=== SERVER STARTING ===');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('JWT Secret exists:', !!process.env.WhatIsYourName);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((error) => console.log("❌ MongoDB connection failed:", error));

// Middleware
app.use(bodyParser.json());

// Request logging
app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ROUTE 1: Test route
app.get('/test', (req, res) => {
    console.log('✅ Test route hit');
    res.json({ 
        message: 'Test route working!',
        timestamp: new Date().toISOString(),
        path: req.path
    });
});

// ROUTE 2: Health check
app.get('/health', (req, res) => {
    console.log('✅ Health route hit');
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        path: req.path
    });
});

// ROUTE 3: Direct vendor test
app.get('/direct-vendors', async (req, res) => {
    console.log('✅ Direct vendors route hit');
    try {
        const Vendor = require('./models/Vendor');
        const vendors = await Vendor.find();
        console.log(`Found ${vendors.length} vendors`);
        res.json({
            message: `Found ${vendors.length} vendors`,
            count: vendors.length,
            vendors: vendors.map(v => ({
                id: v._id,
                username: v.username,
                email: v.email
            })),
            path: req.path
        });
    } catch (error) {
        console.error('❌ Direct vendors error:', error);
        res.status(500).json({ 
            error: 'Database error', 
            details: error.message,
            path: req.path
        });
    }
});

// ROUTE 4: Welcome route (LAST)
app.get('/', (req, res) => {
    console.log('✅ Welcome route hit');
    res.send("<h1>Welcome To The Project</h1>");
});

// Load route files
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');

// API routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));

// Error handling
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    console.log('❌ 404 - Route not found:', req.path);
    res.status(404).json({ 
        error: 'Route not found', 
        path: req.path,
        message: 'This route does not exist'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server started and running at ${PORT}`);
    console.log('📋 Available routes:');
    console.log('   - GET /test');
    console.log('   - GET /health');
    console.log('   - GET /direct-vendors');
    console.log('   - GET /');
    console.log('   - GET /vendor/all-vendors');
    console.log('=== SERVER READY ===');
});