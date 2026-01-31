const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'greenpulse',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let connection;

const connectDB = async () => {
    try {
        connection = mysql.createPool(dbConfig);
        
        // Test the connection
        await connection.getConnection();
        console.log('MySQL Database connected successfully');
        
        // Create tables if they don't exist
        await createTables();
        
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

const createTables = async () => {
    try {
        // Create Users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('citizen', 'admin') DEFAULT 'citizen',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create Reports table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type ENUM('overflow', 'dumping', 'missed', 'damage', 'other') NOT NULL,
                location VARCHAR(255) NOT NULL,
                description TEXT,
                image_url VARCHAR(500),
                status ENUM('pending', 'in-progress', 'resolved') DEFAULT 'pending',
                admin_response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Create Schedules table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS schedules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                area VARCHAR(100) NOT NULL,
                day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
                time VARCHAR(20) NOT NULL,
                waste_type ENUM('General', 'Recyclable', 'Hazardous', 'Organic') DEFAULT 'General',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Database tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err.message);
    }
};

const getConnection = () => connection;

module.exports = { connectDB, getConnection };