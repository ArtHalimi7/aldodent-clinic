/* global process */
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '../db.js';
import { verifyToken } from '../authMiddleware.js';
import { sendWelcomeEmail } from '../emailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '***REMOVED***';

// Register (Signup)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        // Check if user already exists
        const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const newUser = await sql`
            INSERT INTO users (name, email, password_hash)
            VALUES (${name}, ${email}, ${passwordHash})
            RETURNING id, name, email, role, created_at
        `;

        // Generate JWT
        const user = newUser[0];
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        // Trigger welcome email asynchronously
        sendWelcomeEmail(user);

        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password.' });
        }

        // Find user
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        // Remove password hash from response
        // eslint-disable-next-line no-unused-vars
        const { password_hash, ...userWithoutPassword } = user;

        res.json({ user: userWithoutPassword, token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get current user (me)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const users = await sql`SELECT id, name, email, role, created_at FROM users WHERE id = ${req.user.id}`;

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ user: users[0] });
    } catch (err) {
        console.error('Fetch me error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;
