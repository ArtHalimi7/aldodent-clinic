import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// eslint-disable-next-line no-undef
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
    ssl: 'require',
    connect_timeout: 10,
});

export async function initDb() {
    console.log("Starting database initialization...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                surname VARCHAR(255),
                phone VARCHAR(50),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                patient_name VARCHAR(255) NOT NULL,
                patient_phone VARCHAR(50) NOT NULL,
                patient_email VARCHAR(255),
                service VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                time VARCHAR(50) NOT NULL,
                doctor_id VARCHAR(50) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                notes TEXT,
                user_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS blocked_times (
                id SERIAL PRIMARY KEY,
                doctor_id VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                time VARCHAR(50) NOT NULL,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                slug VARCHAR(100) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                duration VARCHAR(100) NOT NULL,
                price VARCHAR(100) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS doctors (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                avatar TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        console.log("Database tables created or already exist.");

        // Seeding initial services if table is empty
        const servicesCount = await sql`SELECT count(*) FROM services`;
        console.log(`Current services count: ${servicesCount[0].count}`);

        if (parseInt(servicesCount[0].count) === 0) {
            console.log("Seeding initial services...");
            const initialServices = [
                { slug: 'kirurgji', title: "Kirurgji", duration: "30–60 min", price: "Sipas rastit" },
                { slug: 'implantologji', title: "Implantologji", duration: "45–90 min", price: "Nga €500" },
                { slug: 'estetike', title: "Estetikë: Kurora Zirkoni – Kurora Emax", duration: "2 seanca", price: "Nga €200/copë" },
                { slug: 'parodontologji', title: "Parodontologji", duration: "30–60 min", price: "Nga €40" },
                { slug: 'ortodonci', title: "Ortodonci", duration: "30 min konsultë", price: "Falas konsulta" },
                { slug: 'endodonci', title: "Endodonci", duration: "60–90 min", price: "Nga €80" },
                { slug: 'mbushje', title: "Mbushje Estetike", duration: "30 min", price: "Nga €40" },
            ];

            for (const s of initialServices) {
                await sql`
                    INSERT INTO services (slug, title, duration, price)
                    VALUES (${s.slug}, ${s.title}, ${s.duration}, ${s.price})
                `;
            }
            console.log("Initial services seeded.");
        }

        // Seeding initial doctors if table is empty
        const doctorsCount = await sql`SELECT count(*) FROM doctors`;
        console.log(`Current doctors count: ${doctorsCount[0].count}`);

        if (parseInt(doctorsCount[0].count) === 0) {
            console.log("Seeding initial doctors...");
            const initialDoctors = [
                { id: 'dr-aldo', name: 'Dr. Aldo', role: 'Kryedoktor & Kirurg', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aldo' },
                { id: 'dr-elena', name: 'Dr. Elena', role: 'Ortodonte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
            ];

            for (const d of initialDoctors) {
                await sql`
                    INSERT INTO doctors (id, name, role, avatar)
                    VALUES (${d.id}, ${d.name}, ${d.role}, ${d.avatar})
                `;
            }
            console.log("Initial doctors seeded.");
        }

        // Seeding initial admin user if table is empty
        const usersCount = await sql`SELECT count(*) FROM users`;
        console.log(`Current users count: ${usersCount[0].count}`);

        if (parseInt(usersCount[0].count) === 0) {
            console.log("Seeding initial admin...");
            // Password is '***REMOVED***' hashed with bcrypt (saltRounds: 10)
            const defaultHashedPassword = '***REMOVED***';

            await sql`
                INSERT INTO users (name, email, password_hash, role)
                VALUES ('Admin User', 'admin@aldodent.com', ${defaultHashedPassword}, 'admin')
            `;
            console.log("Initial admin seeded.");
        }

        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Error initializing database tables:", err);
    }
}

export default sql;
