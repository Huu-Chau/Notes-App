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

// search account
accountRouter.get('', authenToken, async (req, res) => {
    const { user } = req.user
    const isUser = await userModel.findOne({ _id: user._id }).lean()

    if (!isUser) {
        return res.status(400).json({ error: true, message: 'Cannot found user!' })
    }

    res.status(200).json({
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
