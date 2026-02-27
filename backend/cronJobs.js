import cron from 'node-cron';
import sql from './db.js';
import { sendBookingReminder } from './emailService.js';

export const initCronJobs = () => {
    // Run every day at 08:00 AM
    cron.schedule('0 8 * * *', async () => {
        console.log('Running 24h reminder cron job...');
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            const upcomingAppointments = await sql`
                SELECT * FROM appointments 
                WHERE date = ${tomorrowStr} AND status != 'cancelled'
            `;

            console.log(`Found ${upcomingAppointments.length} appointments for tomorrow.`);
            for (const apt of upcomingAppointments) {
                if (apt.patient_email) {
                    await sendBookingReminder(apt);
                }
            }
        } catch (error) {
            console.error('Cron Job Error:', error);
        }
    });
};
