const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Production-ready CORS configuration
app.use(cors({
    origin: ['http://127.0.0.1:5502', 'http://localhost:5502'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Test route to check if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Database connection configuration using Railway variables
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'autorack.proxy.rlwy.net',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'WjSQunJwUmVUuZYaDgvxqqWfrDYbAYng',
    database: process.env.MYSQL_DATABASE || 'railway',
    port: process.env.MYSQLPORT || '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database!');
        console.log('Connection details:', {
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQLPORT
        });
        
        const [rows] = await connection.query('SELECT 1');
        console.log('Test query successful:', rows);
        
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}

// Routes
app.get('/test-db', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        res.json({ 
            message: 'Database connection successful!',
            config: {
                host: process.env.MYSQLHOST,
                user: process.env.MYSQLUSER,
                database: process.env.MYSQL_DATABASE,
                port: process.env.MYSQLPORT
            }
        });
    } catch (error) {
        console.error('Test connection error:', error);
        res.status(500).json({ 
            error: 'Database connection failed', 
            details: error.message,
            config: {
                host: process.env.MYSQLHOST,
                user: process.env.MYSQLUSER,
                database: process.env.MYSQL_DATABASE,
                port: process.env.MYSQLPORT
            }
        });
    }
});

// Add better error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
        console.log(`Server running on port ${PORT}`);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Database config:', {
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQLPORT
        });
        
        const dbConnected = await testConnection();
        if (dbConnected) {
            console.log('Database connection successful');
        } else {
            console.log('Database connection failed');
        }
    } catch (error) {
        console.error('Server startup error:', error);
    }
}); 