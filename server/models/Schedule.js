const { getConnection } = require('../config/db');

class Schedule {
    constructor(area, dayOfWeek, time, wasteType) {
        this.area = area;
        this.dayOfWeek = dayOfWeek;
        this.time = time;
        this.wasteType = wasteType;
    }

    static async create(scheduleData) {
        const connection = getConnection();
        const { area, day_of_week, time, waste_type } = scheduleData;
        
        const [result] = await connection.execute(
            'INSERT INTO schedules (area, day_of_week, time, waste_type) VALUES (?, ?, ?, ?)',
            [area, day_of_week, time, waste_type]
        );
        
        return await this.findById(result.insertId);
    }

    static async findById(id) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM schedules WHERE id = ?',
            [id]
        );
        
        return rows[0] || null;
    }

    static async findAll() {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM schedules ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), time'
        );
        
        return rows;
    }

    static async findByArea(area) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM schedules WHERE area = ? ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), time',
            [area]
        );
        
        return rows;
    }

    static async findByDay(dayOfWeek) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM schedules WHERE day_of_week = ? ORDER BY time',
            [dayOfWeek]
        );
        
        return rows;
    }

    static async update(id, updateData) {
        const connection = getConnection();
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE schedules SET ${setClause} WHERE id = ?`;
        
        await connection.execute(query, [...values, id]);
        return await this.findById(id);
    }

    static async delete(id) {
        const connection = getConnection();
        await connection.execute('DELETE FROM schedules WHERE id = ?', [id]);
        return true;
    }

    static async findByAreaAndDay(area, dayOfWeek) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM schedules WHERE area = ? AND day_of_week = ? ORDER BY time',
            [area, dayOfWeek]
        );
        
        return rows;
    }
}

module.exports = Schedule;