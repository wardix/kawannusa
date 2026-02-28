import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'referral_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const dbInit = async () => {
    try {
        const connection = await pool.getConnection();

        // Create users table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        company_name VARCHAR(255),
        job_title VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        referrer_rank VARCHAR(50) DEFAULT 'Beginner',
        pref_updates_enabled BOOLEAN DEFAULT TRUE,
        pref_auto_withdraw BOOLEAN DEFAULT FALSE,
        bank_account_name VARCHAR(255),
        bank_name VARCHAR(100),
        bank_account_number VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        // Create services table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_name VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create customers table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        referrer_id INT NOT NULL,
        customer_ref_id VARCHAR(100),
        pic_name VARCHAR(255) NOT NULL,
        business_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Aktif',
        activation_date DATETIME,
        emails JSON,
        phones JSON,
        am_name VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(id)
      )
    `);

        // Create points ledger table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS points_ledger (
        id INT AUTO_INCREMENT PRIMARY KEY,
        referrer_id INT NOT NULL,
        customer_id INT,
        service_id INT,
        points_awarded INT NOT NULL,
        status ENUM('MASUK', 'DITARIK') DEFAULT 'MASUK',
        transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `);

        console.log('Database tables verified/created successfully.');
        connection.release();
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
};

export default pool;
