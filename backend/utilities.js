require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const randomString = require('randomstring')
const nodemailer = require('nodemailer')

// middleware
function authenToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401).json({ message: 'No token provided, redirect to login' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401).json({ message: 'No token provided, redirect to login' });
        }
        req.user = user
        next()
    })
}

// pocket functions
function hashPassword(password) {
    // encode the password
    const saltRounds = parseInt(process.env.SALT_ROUND); // You can increase this for more security
    const hashedPassword = bcrypt.hash(password, saltRounds);

    // check if it exists
    if (!hashedPassword) {
        return res.json({ error: true, message: 'Something went wrong!! No hash found!' })
    }
    return hashedPassword
}

function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

function emailVerify(otp, email) {
    const transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        service: 'gmail',
        port: 587, // Ethereal typically uses port 587
        secure: false, // true for port 465, false for port 587
        auth: {
            user: process.env.USER_NAME,
            pass: process.env.USER_PASSWORD,
        },
    });
    // Send the password mailOptions reset email
    const mailOptions = {
        from: {
            name: 'Nguyen Huu Chau',
            address: process.env.USER_NAME,
        },
        to: email,
        subject: 'OTP verification',
        text: `Your OTP for verification is `,
        html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign up process.</p>
            <p>This code <b>expires in 1 hour</b>.</p>`,
    };

    transporter.sendMail(mailOptions)
}

function generateOTP() {
    return randomString.generate({
        length: 4,
        charset: 'numeric',
    })
}

function forgetPassword(token) {
    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'smtp.ethereal.email',
        secure: true,
        auth: {
            user: process.env.USER_NAME,
            pass: process.env.USER_PASSWORD,
        },
    });

    // Send the password mailOptions reset email
    const mailOptions = {
        from: {
            name: 'Nguyen Huu Chau',
            address: process.env.USER_NAME,
        },
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Click the link below to reset your password:
       ${process.env.FORGET_PASSWORD_URL}/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions)
}


module.exports = { authenToken, hashPassword, comparePassword, generateOTP, emailVerify, forgetPassword }