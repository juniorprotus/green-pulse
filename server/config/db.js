const mysql = require("mysql2/promise");

let pool;

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }

    // Create pool using full DATABASE_URL
    pool = mysql.createPool(process.env.DATABASE_URL);

    // Test connection
    const conn = await pool.getConnection();
    conn.release();

    console.log("✅ MySQL database connected successfully");

    await createTables();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('citizen','admin') DEFAULT 'citizen',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('overflow','dumping','missed','damage','other') NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        status ENUM('pending','in-progress','resolved') DEFAULT 'pending',
        admin_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        area VARCHAR(100) NOT NULL,
        day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
        time VARCHAR(20) NOT NULL,
        waste_type ENUM('General','Recyclable','Hazardous','Organic') DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database tables ready");
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
    process.exit(1);
  }
};

const getDB = () => pool;

module.exports = { connectDB, getDB };
