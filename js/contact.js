const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Handle contact form submission
router.post('/',
    [
        body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
        body('email').isEmail().withMessage('Please enter a valid email address'),
        body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters long'),
        body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, subject, message } = req.body;

            // Send email to admin
            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: process.env.ADMIN_EMAIL || 'sudishkarki360@gmail.com',
                subject: `Contact Form: ${subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `
            });

            // Send confirmation email to user
            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Thank you for contacting SudishExpress',
                html: `
                    <h2>Thank you for contacting us!</h2>
                    <p>Dear ${name},</p>
                    <p>We have received your message and will get back to you as soon as possible.</p>
                    <p>Here's a copy of your message:</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                    <br>
                    <p>Best regards,</p>
                    <p>The SudishExpress Team</p>
                `
            });

            res.status(200).json({ message: 'Message sent successfully' });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ message: 'Error sending message. Please try again later.' });
        }
    }
);

module.exports = router; 