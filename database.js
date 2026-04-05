import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'scheme_portal.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize database schema and data
export const initDb = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      // Create Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT,
        age INTEGER,
        gender TEXT,
        state TEXT,
        district TEXT,
        category TEXT,
        income INTEGER,
        education_level TEXT,
        institution_type TEXT
      )`);

      // Create Schemes table
      db.run(`CREATE TABLE IF NOT EXISTS schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scheme_name TEXT NOT NULL,
        provider TEXT NOT NULL,
        target_role TEXT,
        category_required TEXT,
        gender_required TEXT,
        income_limit INTEGER,
        education_required TEXT,
        state TEXT,
        description TEXT,
        official_link TEXT
      )`);

      // Create Admin table
      db.run(`CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`);

      // Create Contacts table for feedback/queries
      db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create Saved Schemes table for bookmarking
      db.run(`CREATE TABLE IF NOT EXISTS saved_schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        scheme_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(scheme_id) REFERENCES schemes(id)
      )`);

      // Seed setup
      db.get("SELECT COUNT(*) as count FROM schemas", (err, row) => {
        // If query fails or returns 0, we can seed. Actually let's just check if there are any schemes
      });

      db.get("SELECT count(*) as count FROM schemes", (err, row) => {
        if (!err && row.count === 0) {
          const sampleSchemes = [
            // Central Government Scholarships
            {
              scheme_name: 'Post Matric Scholarship',
              provider: 'Central Government',
              target_role: 'Student',
              category_required: 'All',
              gender_required: 'All',
              income_limit: 250000,
              education_required: 'Undergraduate',
              state: 'All India',
              description: 'Financial assistance for post-matriculation courses.',
              official_link: 'https://scholarships.gov.in/'
            },
            {
              scheme_name: 'Central Sector Scheme of Scholarships',
              provider: 'Central Government',
              target_role: 'Student',
              category_required: 'All',
              gender_required: 'All',
              income_limit: 450000,
              education_required: 'Undergraduate',
              state: 'All India',
              description: 'For college and university students.',
              official_link: 'https://scholarships.gov.in/'
            },
            {
              scheme_name: 'PM YASASVI Scholarship',
              provider: 'Central Government',
              target_role: 'Student',
              category_required: 'OBC',
              gender_required: 'All',
              income_limit: 250000,
              education_required: 'School',
              state: 'All India',
              description: 'Scholarship for Top Class Education in Schools for OBC, EBC and DNT Students.',
              official_link: 'https://yet.nta.ac.in/'
            },
            {
              scheme_name: 'AICTE Pragati Scholarship',
              provider: 'Central Government',
              target_role: 'Student',
              category_required: 'All',
              gender_required: 'Female',
              income_limit: 800000,
              education_required: 'Undergraduate',
              state: 'All India',
              description: 'Scholarship for girls entering technical courses.',
              official_link: 'https://www.aicte-india.org/'
            },
            {
              scheme_name: 'AICTE Saksham Scholarship',
              provider: 'Central Government',
              target_role: 'Disabled',
              category_required: 'All',
              gender_required: 'All',
              income_limit: 800000,
              education_required: 'Undergraduate',
              state: 'All India',
              description: 'Scholarship for specially-abled students.',
              official_link: 'https://www.aicte-india.org/'
            },
            // Tamil Nadu Scholarships
            {
              scheme_name: 'BC/MBC Scholarship',
              provider: 'Tamil Nadu Government',
              target_role: 'Student',
              category_required: 'BC',
              gender_required: 'All',
              income_limit: 200000,
              education_required: 'Undergraduate',
              state: 'Tamil Nadu',
              description: 'Scholarship for BC/MBC class students in Tamil Nadu.',
              official_link: 'https://bcmbcmw.tn.gov.in/'
            },
            {
              scheme_name: 'SC/ST Scholarship',
              provider: 'Tamil Nadu Government',
              target_role: 'Student',
              category_required: 'SC',
              gender_required: 'All',
              income_limit: 250000,
              education_required: 'Undergraduate',
              state: 'Tamil Nadu',
              description: 'Post-matric scholarship for SC/ST students.',
              official_link: 'https://tnadtwscholarship.tn.gov.in/'
            },
            {
              scheme_name: 'First Graduate Scholarship',
              provider: 'Tamil Nadu Government',
              target_role: 'Student',
              category_required: 'All',
              gender_required: 'All',
              income_limit: 9999999, // practically no limit typically but varies
              education_required: 'Undergraduate',
              state: 'Tamil Nadu',
              description: 'Tuition fee concession for the first graduate in a family.',
              official_link: 'https://services.india.gov.in/service/detail/student-apply-for-first-graduate-certificate-tamil-nadu'
            },
            {
              scheme_name: 'Moovalur Ramamirtham Scheme',
              provider: 'Tamil Nadu Government',
              target_role: 'Women',
              category_required: 'All',
              gender_required: 'Female',
              income_limit: 9999999,
              education_required: 'Undergraduate',
              state: 'Tamil Nadu',
              description: 'Pudhumai Penn scheme - Rs.1000/month for girl students pursuing higher education.',
              official_link: 'https://pudhumaipenn.tn.gov.in/'
            },
            {
              scheme_name: 'Free Laptop Scheme',
              provider: 'Tamil Nadu Government',
              target_role: 'Student',
              category_required: 'All',
              gender_required: 'All',
              income_limit: 9999999,
              education_required: 'School',
              state: 'Tamil Nadu',
              description: 'Free laptops for higher secondary students.',
              official_link: 'https://www.tn.gov.in/'
            }
          ];

          const stmt = db.prepare(`INSERT INTO schemes 
            (scheme_name, provider, target_role, category_required, gender_required, income_limit, education_required, state, description, official_link) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

          sampleSchemes.forEach((s) => {
            stmt.run([s.scheme_name, s.provider, s.target_role, s.category_required, s.gender_required, s.income_limit, s.education_required, s.state, s.description, s.official_link]);
          });
          stmt.finalize();
          console.log("Seeded default schemes.");
        }
      });

      // Seed admin user
      db.get("SELECT count(*) as count FROM admin", async (err, row) => {
        if (!err && row.count === 0) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          db.run("INSERT INTO admin (username, password) VALUES (?, ?)", ['admin', hashedPassword]);
          console.log("Seeded default admin user (admin / admin123).");
        }
      });

      resolve();
    });
  });
};

export default db;
