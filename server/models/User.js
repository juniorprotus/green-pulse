const { getPool } = require('../config/db');

class User {

  // =====================
  // Create user
  // =====================
  static async create({ name, email, password, role }) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role]
      );

      return {
        id: result.insertId,
        name,
        email,
        role
      };
    } finally {
      conn.release();
    }
  }

  // =====================
  // Find by email
  // =====================
  static async findByEmail(email) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } finally {
      conn.release();
    }
  }

  // =====================
  // Find by ID
  // =====================
  static async findById(id) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      conn.release();
    }
  }

  // =====================
  // Find all users
  // =====================
  static async findAll() {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      return rows;
    } finally {
      conn.release();
    }
  }

  // =====================
  // Update user
  // =====================
  static async update(id, updateData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const fields = Object.keys(updateData);
      const values = Object.values(updateData);

      if (fields.length === 0) return this.findById(id);

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      await conn.execute(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      return await this.findById(id);
    } finally {
      conn.release();
    }
  }

  // =====================
  // Delete user
  // =====================
  static async delete(id) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      await conn.execute('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } finally {
      conn.release();
    }
  }
}

module.exports = User;
