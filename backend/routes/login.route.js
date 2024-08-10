// express
const express = require('express')
const loginRouter = express.Router()

// mongoose
const userModel = require('../models/user.model')

// jwt
const jwt = require('jsonwebtoken')

// login acc
loginRouter.post('', async (req, res) => {
    const { email, password } = req.body

    // check if user enters data
    if (!email) {
        return res.status(400).json({ error: true, message: 'Email is required!' })
    }

    if (!password) {
        return res.status(400).json({ error: true, message: 'Password is required!' })
    }

    // check if email is existing
    const userInfo = await userModel.findOne({ email: email })

    if (!userInfo) {
        return res.json({ error: true, message: 'User not found!' })
    }

    // check account valid, yes = data, false = error
    if (userInfo.email == email) {
        if (userInfo.password == password) {
            const user = {
                user: userInfo
            }

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1440m" })

            return res.json({
                error: false,
                message: 'Login Sucessful',
                accessToken
            })
        } else {
            return res.json({
                error: true,
                message: 'Wrong password!'
            })
        }
    } else {
        return res.status(400).json({
            error: true,
            message: 'Invalid credentials.'
        })
    }
})

module.exports = loginRouter
