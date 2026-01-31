const { getConnection } = require('../config/db');

class Report {
    constructor(userId, type, location, description, imageUrl) {
        this.userId = userId;
        this.type = type;
        this.location = location;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    static async create(reportData) {
        const connection = getConnection();
        const { user_id, type, location, description, image_url } = reportData;
        
        const [result] = await connection.execute(
            'INSERT INTO reports (user_id, type, location, description, image_url) VALUES (?, ?, ?, ?, ?)',
            [user_id, type, location, description, image_url]
        );
        
        return await this.findById(result.insertId);
    }

    static async findById(id) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            `SELECT r.*, u.name as user_name, u.email as user_email 
             FROM reports r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.id = ?`,
            [id]
        );
        
        return rows[0] || null;
    }

    static async findByUserId(userId) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            `SELECT r.*, u.name as user_name, u.email as user_email 
             FROM reports r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.user_id = ? 
             ORDER BY r.created_at DESC`,
            [userId]
        );
        
        return rows;
    }

    static async findAll() {
        const connection = getConnection();
        const [rows] = await connection.execute(
            `SELECT r.*, u.name as user_name, u.email as user_email 
             FROM reports r 
             JOIN users u ON r.user_id = u.id 
             ORDER BY r.created_at DESC`
        );
        
        return rows;
    }

    static async update(id, updateData) {
        const connection = getConnection();
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE reports SET ${setClause} WHERE id = ?`;
        
        await connection.execute(query, [...values, id]);
        return await this.findById(id);
    }

    static async delete(id) {
        const connection = getConnection();
        await connection.execute('DELETE FROM reports WHERE id = ?', [id]);
        return true;
    }

    static async findByStatus(status) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            `SELECT r.*, u.name as user_name, u.email as user_email 
             FROM reports r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.status = ? 
             ORDER BY r.created_at DESC`,
            [status]
        );
        
        return rows;
    }
}

module.exports = Report;