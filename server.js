const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

console.log("🔹 Starting server setup...");

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
console.log("✅ Middleware setup complete.");

// Serve static files
app.use(express.static('public'));
console.log("📂 Serving static files from 'public'");

// Debugging middleware
app.use((req, res, next) => {
    console.log(`➡️ Request received: ${req.method} ${req.url}`);
    next();
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    console.log("📝 Handling form submission...");
    const { name, email, message } = req.body;

    // Validate form data
    if (!name || !email || !message) {
        console.log("❌ Validation failed: Missing fields.");
        return res.status(400).send('All fields are required.');
    }

    console.log("✅ Validation passed. Preparing to send email...");

    // Nodemailer setup (USE A TEST EMAIL OR ENV VARIABLES)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fitfusion@gmail.com',  // <-- Change this
            pass: 'Fitfusion'   // <-- Change this
        }
    });

    console.log("📧 Email transporter created.");

    const mailOptions = {
        from: email,
        to: 'fitfusion@gmail.com',
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ Error sending email:", error);
            return res.status(500).send('Error sending email.');
        }
        console.log("✅ Email sent successfully:", info.response);
        res.send('Success! Your email has been sent successfully.');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
