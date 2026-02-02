const mysql = require("mysql2/promise");

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool(process.env.DATABASE_URL, {
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    const conn = await pool.getConnection();
    conn.release();

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };
