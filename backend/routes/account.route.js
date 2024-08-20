// express
const express = require('express')
const accountRouter = express.Router()

// mongoose
const userModel = require('../models/user.model')

// jwt & hash
const { authenToken, hashPassword } = require('../utilities')
const jwt = require('jsonwebtoken')

require('dotenv').config

accountRouter.use(express.json())

// create account
accountRouter.post('', async (req, res) => {
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
        return res.json({ error: true, message: 'User already exist!' })
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

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'Registration Successful'
    })
})
// search account
accountRouter.get('', authenToken, async (req, res) => {
    const { user } = req.user
    const isUser = await userModel.findOne({ _id: user._id }).lean()

    if (!isUser) {
        return res.status(400).json({ error: true, message: 'Cannot found user!' })
    }

    res.json({
        user: {
            _id: isUser._id,
            FullName: isUser.fullName,
            Email: isUser.email,
            Createdin: isUser.createOn
        },
        message: 'Find user complete'
    })
})

module.exports = accountRouter
