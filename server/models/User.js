const { getConnection } = require('../config/db');

class User {
    constructor(name, email, password, role = 'citizen') {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    static async create(userData) {
        const connection = getConnection();
        const { name, email, password, role } = userData;
        
        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        
        return { id: result.insertId, name, email, role };
    }

    static async findByEmail(email) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        return rows[0] || null;
    }

    static async findById(id) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        
        return rows[0] || null;
    }

    static async findAll() {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        
        return rows;
    }

    static async update(id, updateData) {
        const connection = getConnection();
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE users SET ${setClause} WHERE id = ?`;
        
        await connection.execute(query, [...values, id]);
        return await this.findById(id);
    }

    static async delete(id) {
        const connection = getConnection();
        await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        return true;
    }
}

module.exports = User;