const { getPool } = require('../config/db');

class Schedule {
    constructor(area, dayOfWeek, time, wasteType) {
        this.area = area;
        this.dayOfWeek = dayOfWeek;
        this.time = time;
        this.wasteType = wasteType;
    }

    static async create(scheduleData) {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            const { area, day_of_week, time, waste_type } = scheduleData;
            const [result] = await conn.query(
                'INSERT INTO schedules (area, day_of_week, time, waste_type) VALUES (?, ?, ?, ?)',
                [area, day_of_week, time, waste_type]
            );
            return await this.findById(result.insertId);
        } finally {
            conn.release();
        }
    }

    static async findById(id) {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(
                'SELECT * FROM schedules WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } finally {
            conn.release();
        }
    }

    static async findAll() {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(
                'SELECT * FROM schedules ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), time'
            );
            return rows;
        } finally {
            conn.release();
        }
    }

    static async findByArea(area) {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(
                'SELECT * FROM schedules WHERE area = ? ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), time',
                [area]
            );
            return rows;
        } finally {
            conn.release();
        }
    }

    static async findByDay(dayOfWeek) {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(
                'SELECT * FROM schedules WHERE day_of_week = ? ORDER BY time',
                [dayOfWeek]
            );
            return rows;
        } finally {
            conn.release();
        }
    }

    static async findByAreaAndDay(area, dayOfWeek) {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(
                'SELECT * FROM schedules WHERE area = ? AND day_of_week = ? ORDER BY time',
                [area, dayOfWeek]
            );
            return rows;
        } finally {
            conn.release();
        }
    }

    static async update(id, updateData) {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            const fields = Object.keys(updateData);
            const values = Object.values(updateData);
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const query = `UPDATE schedules SET ${setClause} WHERE id = ?`;
            await conn.query(query, [...values, id]);
            return await this.findById(id);
        } finally {
            conn.release();
        }
    }

    static async delete(id) {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            await conn.query('DELETE FROM schedules WHERE id = ?', [id]);
            return true;
        } finally {
            conn.release();
        }
    }
}

module.exports = Schedule;
