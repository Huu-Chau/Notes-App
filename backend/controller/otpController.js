// mongoose
const otpModel = require('../models/otp.model')

// jwt
const jwt = require('jsonwebtoken')

// .env
require('dotenv').config

const otpCreate = async (req, res) => {
    const { userId, otp } = req.body
    // check if user enters data
    if (!otp) {
        return res.status(400).json({ error: true, message: 'OTP is required!' })
    }

    if (!userId) {
        return res.status(400).json({ error: true, message: 'userId is required!' })
    }

    try {
        const OTP = new otpModel({
            userId,
            otp,
            createOn,
        })
        await OTP.save()

        return res.status(200).json({
            message: 'Create otp Successfully',
            OTP,
            error: false,
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
}
// otp send
const otpSend = async (req, res) => {
    const { token } = req.query

    try {
        const user = jwt.sign(token, process.env.ACCESS_TOKEN_SECRET)

        const OTP = generateOTP()

        const otpValidate = new otpModel({
            otp: OTP,
            userId: user._id,
        })

        await otpValidate.save()

        emailVerify(OTP, user.email)

        return res.status(200).json({
            message: 'OTP reqest sent successfully',
            error: false,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Something went wrong',
            error: true,
        })
    }
}

module.exports = { otpCreate, otpSend }