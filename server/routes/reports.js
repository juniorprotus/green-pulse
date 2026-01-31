const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const User = require('../models/User');
const { sendReportEmail, sendStatusUpdateEmail } = require('../services/email');

// @route   POST api/reports
// @desc    Create a report
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { type, location, description, imageUrl } = req.body;

        const newReport = await Report.create({
            user_id: req.user.id,
            type,
            location,
            description,
            image_url: imageUrl
        });

        // Send Email Notification
        const user = await User.findById(req.user.id);
        if (user && user.email) {
            await sendReportEmail(user.email, newReport);
        }

        res.json(newReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports
// @desc    Get all reports (Admin sees all, Citizen sees theirs)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let reports;

        // Check if user is admin or citizen
        if (req.user.role === 'admin') {
            reports = await Report.findAll();
        } else {
            reports = await Report.findByUserId(req.user.id);
        }

        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/:id
// @desc    Get a specific report
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ msg: 'Report not found' });
        }

        // Check if user can access this report
        if (req.user.role !== 'admin' && report.user_id !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        res.json(report);
    } catch (err) {
        console.error(err.message);
        if (err.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ msg: 'Database error' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/reports/:id
// @desc    Update report status (Admin only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const { status, adminResponse } = req.body;

        // Build report object
        const reportFields = {};
        if (status) reportFields.status = status;
        if (adminResponse) reportFields.admin_response = adminResponse;

        const report = await Report.update(req.params.id, reportFields);

        if (!report) {
            return res.status(404).json({ msg: 'Report not found' });
        }

        // Send Email Notification on Update
        if (report.user_email) {
            await sendStatusUpdateEmail(report.user_email, report);
        }

        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/reports/:id
// @desc    Delete a report (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ msg: 'Report not found' });
        }

        await Report.delete(req.params.id);
        res.json({ msg: 'Report removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/status/:status
// @desc    Get reports by status
// @access  Private (Admin only)
router.get('/status/:status', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const reports = await Report.findByStatus(req.params.status);
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;