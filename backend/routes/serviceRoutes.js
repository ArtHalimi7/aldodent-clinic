import express from 'express';
import sql from '../db.js';
import { verifyToken, requireRole } from '../authMiddleware.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await sql`SELECT * FROM services ORDER BY id ASC`;
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create service (Admin only)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const { title, duration, price } = req.body;
        // Generate a simple slug from title
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

        const newService = await sql`
            INSERT INTO services (slug, title, duration, price)
            VALUES (${slug}, ${title}, ${duration}, ${price})
            RETURNING *
        `;
        res.status(201).json(newService[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update service (Admin only)
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, duration, price } = req.body;
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

        const updated = await sql`
            UPDATE services 
            SET title = ${title}, duration = ${duration}, price = ${price}, slug = ${slug} 
            WHERE id = ${id} 
            RETURNING *
        `;
        if (updated.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete service (Admin only)
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM services WHERE id = ${id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
