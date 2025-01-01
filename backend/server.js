const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Production-ready CORS configuration
app.use(cors({
    origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Device-ID'],
    credentials: true
}));

app.use(express.json());

// Database connection for production
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

// Login endpoint with error handling
app.post('/auth/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body); // Debug log

        const { email, password, deviceId } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        console.log('Found users:', users.length); // Debug log

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        console.log('Password valid:', validPassword); // Debug log

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user.id, deviceId }, 
            'your-secret-key', // Replace with a proper secret key in production
            { expiresIn: '24h' }
        );

        // Store session
        await pool.execute(
            'INSERT INTO user_sessions (user_id, device_id, token) VALUES (?, ?, ?)',
            [user.id, deviceId, token]
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error); // Debug log
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Verify endpoint
app.get('/auth/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const deviceId = req.headers['device-id'];

        if (!token || !deviceId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Check session
        const [sessions] = await pool.execute(
            'SELECT * FROM user_sessions WHERE token = ? AND device_id = ?',
            [token, deviceId]
        );

        if (sessions.length === 0) {
            return res.status(401).json({ message: 'Invalid session' });
        }

        res.json({ valid: true });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something broke!',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 