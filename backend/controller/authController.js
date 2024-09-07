// mongoose
const userModel = require('../models/user.model')

// jwt
const jwt = require('jsonwebtoken')

// hash
const { comparePassword, emailVerify, generateOTP } = require('../utilities')

// .env
require('dotenv').config

// token authentication
const { hashPassword, forgetPassword } = require('../utilities')
const otpModel = require('../models/otp.model')

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

    if (userInfo?.status === 'unverified') {
        const OTP = generateOTP()

        const isUserOtp = await otpModel.findOneAndUpdate({ email: email }, {
            otp: OTP,
            type: 'email-verify',
        })

        if (!isUserOtp) {
            const otpValidate = new otpModel({
                otp: OTP,
                email,
                type: 'email-verify',
            })

            await otpValidate.save()
        }

        emailVerify(OTP, email)
        return res.status(200).json({
            message: 'User must verify before log in',
            status: userInfo.status,
            error: false
        })
    }

    const passwordValidate = await comparePassword(password, userInfo.password)

    // check account valid, yes = data, false = error
    if (userInfo.email !== email) {
        return res.status(400).json({
            message: 'Invalid credentials',
            error: true,
        })
    }

    if (!passwordValidate) {
        return res.status(401).json({
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
    const { fullName, email, password, type } = req.body

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
    let isUser = await userModel.findOne({ email: email })
    if (isUser && isUser.status === 'verified') {
        // not know the status is
        return res.status(409).json({ error: true, status: isUser.status, message: 'User already verified!' })
    }
    if (!isUser) {
        const hashPass = await hashPassword(password)
        // insert a new db model and saves it
        isUser = new userModel({
            fullName,
            email,
            password: hashPass,
            status: 'unverified',
        })
        await isUser.save()
    }

    const OTP = generateOTP()

    const isUserOtp = await otpModel.findOneAndUpdate({ email: email }, {
        otp: OTP,
        type,
    })

    if (!isUserOtp) {
        const otpValidate = new otpModel({
            otp: OTP,
            email,
            type,
        })

        await otpValidate.save()
    }

    emailVerify(OTP, isUser.email)

    return res.status(200).json({
        error: false,
        message: 'Registration Successful, now sending OTP verification',
        email,
        status: isUser.status,
    })
}
// forget pass
const userForgetPassword = async (req, res) => {
    const { email, type } = req.body
    // check if user enters data
    if (!email) {
        return res.status(400).json({ message: 'Email is required!', error: true, })
    }

    // check if email is existing (no not every unhappy case is neccessary)

    try {
        const OTP = generateOTP()

        const isUserOtp = await otpModel.findOneAndUpdate({ email: email, type: type }, {
            otp: OTP,
        })

        if (!isUserOtp) {
            const otpValidate = new otpModel({
                otp: OTP,
                email,
                type,
            })

            await otpValidate.save()
        }

        forgetPassword(OTP, email)

        return res.status(200).json({
            message: 'Password reset request sent Successfully. Please check your email to reset your password',
            error: false,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Something went wrong',
            error: true,
        })
    }
}
// reset pass
const userResetPassword = async (req, res) => {
    const { email, password, otp, type } = req.body

    // check if user enters data
    if (!password) {
        return res.status(400).json({ message: 'Password is required!', error: true, })
    }
    try {
        const accountOTPValidate = await otpModel.findOne({
            email: email,
            type: type,
            otp: otp,
        })

        if (!accountOTPValidate) {
            return res.status(400).json({ message: 'Something went wrong!', error: true, })
        }

        const user = await userModel.findOne({ email: email })

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
// verify email
const userEmailVerify = async (req, res) => {
    const { email, otp, type } = req.body
    try {
        const otpValidate = await otpModel.findOne({ email: email, type: type })
        if (otpValidate.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP',
                error: true,
            })
        }

        const updateUserStatus = await userModel.findOne({
            email: email
        })
        if (!updateUserStatus) {
            return res.status(401).json({
                message: 'Unable to update status',
                error: true,
            })
        }
        if (type === 'reset-password') {
            return res.status(200).json({
                message: 'User Authentication successfully, please wait and reset your password.',
                type,
                error: false,
            })
        }

        await updateUserStatus.updateOne({
            status: 'verified'
        })
        await updateUserStatus.save()

        return res.status(200).json({
            message: 'User Authentication successfully',
            type,
            status: updateUserStatus.status,
            error: false,
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
            error: true,
        })
    }
}

module.exports = {
    userLogin,
    userRegister,
    userForgetPassword,
    userResetPassword,
    userEmailVerify,
}