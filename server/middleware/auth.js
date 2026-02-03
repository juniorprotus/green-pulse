const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');  // ✅ use getPool instead of pool

// =====================
// Register a new user
// =====================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const pool = getPool();                  // ✅ get the pool AFTER DB is connected
    const conn = await pool.getConnection(); // ✅ now this works

    // Insert the user (you can hash the password if you want)
    const [rows] = await conn.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    conn.release();

    // Respond with success
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// Export the router
// =====================
module.exports = router;
