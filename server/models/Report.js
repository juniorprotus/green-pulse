const { getPool } = require('../config/db');

class Report {

  // =====================
  // Create report
  // =====================
  static async create(reportData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const { user_id, type, location, description, image_url } = reportData;

      const [result] = await conn.execute(
        `INSERT INTO reports (user_id, type, location, description, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, type, location, description, image_url]
      );

      return await this.findById(result.insertId);
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
        `SELECT r.*, u.name AS user_name, u.email AS user_email
         FROM reports r
         JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [id]
      );

      return rows[0] || null;
    } finally {
      conn.release();
    }
  }

  // =====================
  // Find by user
  // =====================
  static async findByUserId(userId) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        `SELECT r.*, u.name AS user_name, u.email AS user_email
         FROM reports r
         JOIN users u ON r.user_id = u.id
         WHERE r.user_id = ?
         ORDER BY r.created_at DESC`,
        [userId]
      );

      return rows;
    } finally {
      conn.release();
    }
  }

  // =====================
  // Find all
  // =====================
  static async findAll() {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        `SELECT r.*, u.name AS user_name, u.email AS user_email
         FROM reports r
         JOIN users u ON r.user_id = u.id
         ORDER BY r.created_at DESC`
      );

      return rows;
    } finally {
      conn.release();
    }
  }

  // =====================
  // Update report
  // =====================
  static async update(id, updateData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const fields = Object.keys(updateData);
    if (fields.length === 0) return this.findById(id);

    const values = Object.values(updateData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const conn = await pool.getConnection();
    try {
      await conn.execute(
        `UPDATE reports SET ${setClause} WHERE id = ?`,
        [...values, id]
      );

      return await this.findById(id);
    } finally {
      conn.release();
    }
  }

  // =====================
  // Delete report
  // =====================
  static async delete(id) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      await conn.execute(
        'DELETE FROM reports WHERE id = ?',
        [id]
      );
      return true;
    } finally {
      conn.release();
    }
  }

  // =====================
  // Find by status
  // =====================
  static async findByStatus(status) {
    const pool = getPool();
    if (!pool) throw new Error('Database not initialized');

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        `SELECT r.*, u.name AS user_name, u.email AS user_email
         FROM reports r
         JOIN users u ON r.user_id = u.id
         WHERE r.status = ?
         ORDER BY r.created_at DESC`,
        [status]
      );

      return rows;
    } finally {
      conn.release();
    }
  }
}

module.exports = Report;
