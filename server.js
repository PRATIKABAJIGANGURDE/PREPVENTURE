const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/', express.static(__dirname));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pratik121ff@ybl',
    database: 'login_system'
}).promise();

// Test database connection
db.connect()
    .then(() => console.log('Database connected successfully'))
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); // Stop server if database connection fails
    });

// Registration endpoint with better error handling
app.post('/api/register', async (req, res) => {
    console.log('Registration request received:', req.body); // Debug log

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        console.log('User registered successfully:', result); // Debug log

        res.json({ 
            success: true, 
            message: 'Registration successful' 
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Check for duplicate entry error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                error: 'Username or email already exists' 
            });
        }

        res.status(500).json({ 
            error: 'Registration failed', 
            details: error.message 
        });
    }
});

// Login endpoint with better error handling
app.post('/api/login', async (req, res) => {
    console.log('Login request received:', req.body); // Debug log

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Get user from database
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        console.log('Found users:', users.length); // Debug log

        if (users.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = users[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        console.log('Login successful for user:', user.username); // Debug log

        res.json({ 
            success: true, 
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed', 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});