import express from 'express';
import sql from '../db.js';

const router = express.Router();

// GET all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await sql`SELECT * FROM doctors ORDER BY created_at ASC`;
        res.json(doctors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET a single doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await sql`SELECT * FROM doctors WHERE id = ${id}`;
        if (doctor.length === 0) return res.status(404).json({ error: 'Doctor not found' });
        res.json(doctor[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
