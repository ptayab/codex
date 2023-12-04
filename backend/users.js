const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Node.js crypto library for generating secure random secrets
const db = require('./database');

const router = express.Router();

const generateAccessToken = (userId) => {
    const secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
    return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

// Fetch all users (admin access)
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(users);
    });
});

// Register a new user
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Check if the user already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, existingUser) => {
        if (err) {
            console.error('Error checking existing user:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Insert the new user into the database
            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (insertErr, results) => {
                if (insertErr) {
                    console.error('Error creating user:', insertErr.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                // Generate and send the JWT token in the response
                const accessToken = generateAccessToken(results.insertId);
                return res.status(201).json({ message: 'User created successfully', userId: results.insertId, accessToken });
            });
        });
    });
});

// Authenticate user (login)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Fetch user by username
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (user.length === 0) {
            return res.status(401).json('Invalid Inputs');
        }

        // Compare the entered password with the hashed password
        bcrypt.compare(password, user[0].password, (compareErr, passwordMatch) => {
            if (compareErr) {
                console.error('Error comparing passwords:', compareErr.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (!passwordMatch) {
                return res.status(401).json('Invalid Inputs' );
            }

            // Generate and send the JWT token in the response
            const accessToken = generateAccessToken(user[0].id);
            return res.status(200).json({ message: 'Login successful', userId: user[0].id, accessToken });
        });
    });
});

module.exports = router;
