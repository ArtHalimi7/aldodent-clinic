import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// eslint-disable-next-line no-undef
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

export async function initDb() {
    try {
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

        // Seeding initial services if table is empty
        const servicesCount = await sql`SELECT count(*) FROM services`;
        if (parseInt(servicesCount[0].count) === 0) {
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
        if (parseInt(doctorsCount[0].count) === 0) {
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

        console.log("Database tables initialized successfully (created if not existed).");
    } catch (err) {
        console.error("Error initializing database tables:", err);
    }
}

export default sql;
