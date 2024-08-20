// express
const express = require('express')
const loginRouter = express.Router()

// mongoose
const userModel = require('../models/user.model')

// jwt
const jwt = require('jsonwebtoken')

// hash
const { hashPassword, comparePassword } = require('../utilities')

require('dotenv').config

// login acc
loginRouter.post('', async (req, res) => {
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
        return res.json({ message: 'User not found!', error: true, })
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
        return res.json({
            message: 'Wrong password!',
            error: true,
        })
    }

    const user = {
        user: userInfo
    }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1440m" })

    return res.json({
        message: 'Login Sucessful',
        accessToken,
        userId: userInfo._id,
        error: false,
    })
})

module.exports = loginRouter
