// mongoose
const userModel = require('../models/user.model')

// jwt
const jwt = require('jsonwebtoken')

// hash
const { comparePassword } = require('../utilities')

// .env
require('dotenv').config

// token authentication
const { hashPassword } = require('../utilities')

// notemailler
const nodemailer = require('nodemailer');

// login
const userLogin = async (req, res) => {
    const { email, password } = req.body

    // check if user enters data
    if (!email) {
        return res.status(400).json({ message: 'Email is required!', error: true, })
    }

    if (!password) {
        return res.status(400).json({ message: 'Password is required!', error: true, })
    }

    // check if email is existing
    const userInfo = await userModel.findOne({ email: email })

    if (!userInfo) {
        return res.status(404).json({ message: 'User not found!', error: true, })
    }

    // const 

    const passwordValidate = await comparePassword(password, userInfo.password)

    // check account valid, yes = data, false = error
    if (userInfo.email !== email) {
        return res.status(400).json({
            message: 'Invalid credentials',
            error: true,
        })
    }

    if (!passwordValidate) {
        return res.stauts(401).json({
            message: 'Wrong password!',
            error: true,
        })
    }

    const user = {
        user: userInfo
    }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1440m" })

    return res.status(200).json({
        message: 'Login Sucessful',
        accessToken,
        userId: userInfo._id,
        error: false,
    })
}
// register
const userRegister = async (req, res) => {
    const { fullName, email, password } = req.body
    // check if user enters data
    if (!fullName) {
        return res.status(400).json({ error: true, message: 'Full name is required!' })
    }

    if (!email) {
        return res.status(400).json({ error: true, message: 'Email is required!' })
    }

    if (!password) {
        return res.status(400).json({ error: true, message: 'Password is required!' })
    }

    // check if exist
    const isUser = await userModel.findOne({ email: email })

    if (isUser) {
        return res.status(409).json({ error: true, message: 'User already exist!' })
    }

    const hashPass = await hashPassword(password)

    // insert a new db model and saves it
    const user = new userModel({
        fullName,
        email,
        password: hashPass,
    })

    await user.save()

    // also creates an token
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1440m' })

    return res.status(200).json({
        error: false,
        message: 'Registration Successful'
    })
}
// forget pass
const userForgetPassword = async (req, res) => {
    const { email } = req.body
    // check if user enters data
    if (!email) {
        return res.status(400).json({ message: 'Email is required!', error: true, })
    }

    // check if email is existing
    const userInfo = await userModel.findOne({ email: email })
    if (!userInfo) {
        return res.status(404).json({ message: 'User not exist!', error: true, })
    }

    try {
        // create the token to put in the email content url
        const token = jwt.sign({ id: userInfo._id, email: userInfo.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24m' })

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.USER_NAME,
                pass: process.env.USER_PASSWORD,
            },
        });

        // Send the password reciever reset email
        const reciever = {
            from: {
                name: 'Nguyen Huu Chau',
                address: process.env.USER_NAME,
            },
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click the link below to reset your password:
           ${process.env.FORGET_PASSWORD_URL}/reset-password/${token}`,
        };

        transporter.sendMail(reciever)

        return res.status(200).json({
            message: 'Password reset request sent Successfully. Please check your email to reset your password',
            error: false,
        })
    } catch (error) {
        console.log('error')
        return res.status(500).json({
            message: 'Something went wrong',
            error: true,
        })
    }
}
// reset pass
const userResetPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    // check if user enters data
    if (!password) {
        return res.status(400).json({ message: 'Password is required!', error: true, })
    }
    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await userModel.findOne({ email: decode.email })

        const newHashPassword = await hashPassword(password)

        user.password = newHashPassword

        await user.save()

        return res.status(200).json({
            message: 'Password reset Sucessfully',
            error: false,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
            error: true,
        })
    }
}

module.exports = { userLogin, userRegister, userForgetPassword, userResetPassword }