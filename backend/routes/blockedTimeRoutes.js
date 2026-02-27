import express from 'express';
import sql from '../db.js';
import { verifyToken, requireRole } from '../authMiddleware.js';

const router = express.Router();

// Get all blocked times
router.get('/', async (req, res) => {
    try {
        const blocks = await sql`SELECT * FROM blocked_times ORDER BY date ASC, time ASC`;
        res.json(blocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create blocked time (Admin only)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const { doctor_id, date, time, type, title } = req.body;
        const newBlock = await sql`
            INSERT INTO blocked_times (doctor_id, date, time, type, title)
            VALUES (${doctor_id}, ${date}, ${time}, ${type}, ${title})
            RETURNING *
        `;
        res.status(201).json(newBlock[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete blocked time (Admin only)
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM blocked_times WHERE id = ${id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
