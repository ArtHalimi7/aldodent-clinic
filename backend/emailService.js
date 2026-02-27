/* global process */
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

export const sendWelcomeEmail = async (user) => {
    if (!user.email) return;

    try {
        const data = await resend.emails.send({
            from: `AldoDent <${senderEmail}>`,
            to: user.email,
            subject: 'Welcome to AldoDent!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0b2e59;">Welcome, ${user.name}!</h2>
                    <p>Thank you for creating an account with AldoDent.</p>
                    <p>You can now book appointments, view your upcoming visits, and manage your profile easily through our portal.</p>
                    <p>If you have any questions, feel free to reply to this email or call us.</p>
                    <br>
                    <p>Best regards,</p>
                    <p><strong>The AldoDent Team</strong></p>
                </div>
            `
        });
        console.log(`Welcome email sent to ${user.email} / ID: ${data.id}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

export const sendBookingConfirmation = async (appointment) => {
    if (!appointment.patient_email) return;

    try {
        const data = await resend.emails.send({
            from: `AldoDent <${senderEmail}>`,
            to: appointment.patient_email,
            subject: 'Booking Confirmation - AldoDent',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0b2e59;">Booking Confirmed!</h2>
                    <p>Hello ${appointment.patient_name},</p>
                    <p>Your appointment has been successfully booked.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Service:</strong> ${appointment.service}</p>
                        <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${appointment.time}</p>
                    </div>
                    <p>If you need to reschedule or cancel, please contact us.</p>
                    <p>Thank you,<br>AldoDent Team</p>
                </div>
            `
        });
        console.log(`Confirmation email sent manually to ${appointment.patient_email} / ID: ${data.id}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

export const sendBookingCancellation = async (appointment) => {
    if (!appointment.patient_email) return;

    try {
        const data = await resend.emails.send({
            from: `AldoDent <${senderEmail}>`,
            to: appointment.patient_email,
            subject: 'Booking Cancelled - AldoDent',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #d9534f;">Booking Cancelled</h2>
                    <p>Hello ${appointment.patient_name},</p>
                    <p>Your appointment for <strong>${appointment.service}</strong> on <strong>${new Date(appointment.date).toLocaleDateString()}</strong> at <strong>${appointment.time}</strong> has been cancelled.</p>
                    <p>If this was a mistake or you'd like to reschedule, please visit our website.</p>
                    <p>Thank you,<br>AldoDent Team</p>
                </div>
            `
        });
        console.log(`Cancellation email sent to ${appointment.patient_email} / ID: ${data.id}`);
    } catch (error) {
        console.error('Error sending cancellation email:', error);
    }
};

export const sendBookingReminder = async (appointment) => {
    if (!appointment.patient_email) return;

    try {
        const data = await resend.emails.send({
            from: `AldoDent <${senderEmail}>`,
            to: appointment.patient_email,
            subject: 'Appointment Reminder - AldoDent',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0b2e59;">Appointment Reminder</h2>
                    <p>Hello ${appointment.patient_name},</p>
                    <p>This is a friendly reminder that you have an upcoming appointment tomorrow.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Service:</strong> ${appointment.service}</p>
                        <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${appointment.time}</p>
                    </div>
                    <p>We look forward to seeing you!</p>
                    <p>Thank you,<br>AldoDent Team</p>
                </div>
            `
        });
        console.log(`Reminder email sent to ${appointment.patient_email} / ID: ${data.id}`);
    } catch (error) {
        console.error('Error sending reminder email:', error);
    }
};

export const testEmail = async () => {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'test@example.com',
            subject: 'Hello World',
            html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        });
        console.log('Test email sent!', data);
    } catch (err) {
        console.error('Test email failed:', err);
    }
};
