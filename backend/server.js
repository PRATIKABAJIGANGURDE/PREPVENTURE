const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use('/components', express.static(path.join(__dirname, '../components')));

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Pratik121ff@ybl',
    database: 'prepventure'
});

// Database initialization
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

initializeDatabase();

// Auth Routes
app.post('/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if user exists
        const [existingUsers] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name]
        );

        // Create token
        const token = jwt.sign(
            { userId: result.insertId },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email); // Debug log

        // Find user
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        console.log('Found users:', users.length); // Debug log

        if (users.length === 0) {
            console.log('No user found with this email'); // Debug log
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch); // Debug log

        if (!isMatch) {
            console.log('Password does not match'); // Debug log
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user.id },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', user.id); // Debug log
        res.json({ 
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route middleware
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication required' });
    }
};

// Example protected route
app.get('/protected', auth, async (req, res) => {
    try {
        const [user] = await pool.execute(
            'SELECT id, email, name FROM users WHERE id = ?',
            [req.userId]
        );
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a test endpoint to verify user data
app.get('/auth/verify', auth, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, email, name FROM users WHERE id = ?',
            [req.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: users[0]
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
}); 