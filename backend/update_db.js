import sql from './db.js';

async function updateDb() {
    try {
        console.log("Adding new columns to 'users' table...");
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS surname VARCHAR(255);`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`;
        console.log("Successfully added surname and phone to users table.");
    } catch (err) {
        console.error("Failed to update db schema:", err);
    } finally {
        process.exit(0);
    }
}

updateDb();
