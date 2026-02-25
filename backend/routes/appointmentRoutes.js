import express from 'express';
import sql from '../db.js';

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await sql`SELECT * FROM appointments ORDER BY date ASC, time ASC`;
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create appointment
router.post('/', async (req, res) => {
    try {
        const { patient_name, patient_phone, patient_email, service, date, time, doctor_id, notes } = req.body;
        const newApt = await sql`
            INSERT INTO appointments (patient_name, patient_phone, patient_email, service, date, time, doctor_id, notes)
            VALUES (${patient_name}, ${patient_phone}, ${patient_email}, ${service}, ${date}, ${time}, ${doctor_id}, ${notes})
            RETURNING *
        `;
        res.status(201).json(newApt[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update appointment status (confirm/pending)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await sql`
            UPDATE appointments SET status = ${status} WHERE id = ${id} RETURNING *
        `;
        if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM appointments WHERE id = ${id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
