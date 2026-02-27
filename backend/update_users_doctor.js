import sql from './db.js';

async function updateDbRole() {
    try {
        console.log("Adding doctor_id column to 'users' table...");
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS doctor_id VARCHAR(50) REFERENCES doctors(id);`;
        console.log("Successfully added doctor_id col to users table.");
    } catch (err) {
        console.error("Failed to update db schema:", err);
    } finally {
        process.exit(0);
    }
}

updateDbRole();
