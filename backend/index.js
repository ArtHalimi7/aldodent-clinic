/* global process */
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import blockedTimeRoutes from './routes/blockedTimeRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blocked-times', blockedTimeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/doctors', doctorRoutes);

const PORT = process.env.PORT || 5000;
initDb().then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`Backend server running on port ${PORT}`));
});
