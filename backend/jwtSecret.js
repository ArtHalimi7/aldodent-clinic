/* global process */
import crypto from 'crypto';

// One JWT secret for signing and verifying, read lazily (dotenv loads in db.js).
// No hardcoded fallback: without JWT_SECRET a random per-process secret is used,
// so tokens can't be forged (sessions just reset on restart).
const RANDOM_SECRET = crypto.randomBytes(48).toString('hex');
let warned = false;

export function getJwtSecret() {
    if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
    if (!warned) {
        console.warn('JWT_SECRET is not set; using a random secret, so sessions reset on restart.');
        warned = true;
    }
    return RANDOM_SECRET;
}
