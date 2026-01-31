const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Schedule = require('../models/Schedule');

// @route   GET api/schedules
// @desc    Get all schedules
// @access  Public
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.findAll();
        res.json(schedules);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/schedules/area/:area
// @desc    Get schedules by area
// @access  Public
router.get('/area/:area', async (req, res) => {
    try {
        const schedules = await Schedule.findByArea(req.params.area);
        res.json(schedules);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/schedules/day/:day
// @desc    Get schedules by day
// @access  Public
router.get('/day/:day', async (req, res) => {
    try {
        const schedules = await Schedule.findByDay(req.params.day);
        res.json(schedules);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/schedules/area/:area/day/:day
// @desc    Get schedules by area and day
// @access  Public
router.get('/area/:area/day/:day', async (req, res) => {
    try {
        const schedules = await Schedule.findByAreaAndDay(req.params.area, req.params.day);
        res.json(schedules);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/schedules
// @desc    Add a schedule
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const { area, dayOfWeek, time, wasteType } = req.body;

        const newSchedule = await Schedule.create({
            area,
            day_of_week: dayOfWeek,
            time,
            waste_type: wasteType
        });

        res.json(newSchedule);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/schedules/:id
// @desc    Update a schedule
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const { area, dayOfWeek, time, wasteType } = req.body;

        const updateData = {};
        if (area) updateData.area = area;
        if (dayOfWeek) updateData.day_of_week = dayOfWeek;
        if (time) updateData.time = time;
        if (wasteType) updateData.waste_type = wasteType;

        const schedule = await Schedule.update(req.params.id, updateData);

        if (!schedule) {
            return res.status(404).json({ msg: 'Schedule not found' });
        }

        res.json(schedule);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/schedules/:id
// @desc    Delete a schedule
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ msg: 'Schedule not found' });
        }

        await Schedule.delete(req.params.id);
        res.json({ msg: 'Schedule removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;