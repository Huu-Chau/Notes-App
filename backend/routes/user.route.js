// express
const express = require('express')
const userRouter = express.Router()

// mongoose
const userModel = require('../models/user.model')

// jwt & hash
const { authenToken, hashPassword } = require('../utilities')
const jwt = require('jsonwebtoken')

require('dotenv').config

userRouter.use(express.json())

// search account
userRouter.get('', async (req, res) => {
    const { fullName, email, status } = req.body

    try {
        const userFinder = await userModel.findOne({
            $or: [
                { fullName },
                { email },
                { status },
            ]
        })
        console.log("userFinder", userFinder)
        if (!userFinder) {
            return res.status(440).json({ error: true, message: 'Cannot found user!' })
        }
        return res.status(200).json({
            status: userFinder.status,
            message: 'Find user complete'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        })
    }
})

// update account
userRouter.patch('', authenToken, async (req, res) => {
    const { fullName, email, status } = req.body
    const { user } = req.user

    if (!user) {
        return res.status(404).json({
            message: 'Cannot found the users',
            error: true,
        })
    }
    try {
        const updateUser = await userModel.findOne({ _id: user._id })

        // insert value
        updateUser.fullName = fullName || updateUser.fullName;
        updateUser.email = email || updateUser.email;
        updateUser.status = status || updateUser.status;

        await updateUser.save()

        return res.status(200).json({
            message: 'update note successfully',
            updateUser,
            error: false,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        })
    }
})

module.exports = userRouter
