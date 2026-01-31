const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendReportEmail = async (userEmail, reportDetails) => {
    const mailOptions = {
        from: `"GreenPulse Support" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Report Received - GreenPulse',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Hello, Thank you for reporting!</h2>
                <p>We have received your report regarding: <strong>${reportDetails.type}</strong></p>
                <p><strong>Location:</strong> ${reportDetails.location}</p>
                <p><strong>Status:</strong> Pending Review</p>
                <hr>
                <p>Our team will investigate this issue shortly. You can track the status on your dashboard.</p>
                <p>Best regards,<br>The GreenPulse Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notification email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendStatusUpdateEmail = async (userEmail, reportDetails) => {
    const mailOptions = {
        from: `"GreenPulse Admin" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Report Status Updated - GreenPulse',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Update on your report</h2>
                <p>The status of your report (ID: ${reportDetails.id}) has been updated to: <strong style="color: #10B981;">${reportDetails.status}</strong></p>
                ${reportDetails.admin_response ? `<p><strong>Admin Note:</strong> ${reportDetails.admin_response}</p>` : ''}
                <hr>
                <p>Thank you for helping us keep the city clean!</p>
                <p>Regards,<br>GreenPulse Management</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Status update email sent successfully');
    } catch (error) {
        console.error('Error sending update email:', error);
    }
};

module.exports = { sendReportEmail, sendStatusUpdateEmail };