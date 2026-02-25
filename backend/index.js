/* global process */
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import blockedTimeRoutes from './routes/blockedTimeRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';

const app = express();
app.use(cors({
    origin: ['https://aldodent.netlify.app', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

// Routes
app.get('/ping', (req, res) => res.send('pong'));
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blocked-times', blockedTimeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/doctors', doctorRoutes);

const PORT = process.env.PORT || 5000;
initDb().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Backend server running on port ${PORT}`);

        // Keep-alive: Ping the server every 2 minutes
        setInterval(() => {
            fetch('https://aldodent.onrender.com/ping')
                .then(() => console.log('Self-ping successful'))
                .catch(err => console.error('Self-ping failed:', err));
        }, 120000);
    });
});
