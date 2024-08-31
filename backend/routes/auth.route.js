// express
const express = require('express')
const authRouter = express.Router()

// import controller
const {
    userLogin,
    userRegister,
    userForgetPassword,
    userResetPassword,
    userEmailVerify,
} = require('../controller/authController')
const { authenToken } = require('../utilities')

authRouter.use(express.json())

// login acc
authRouter.post('/login', userLogin)

// register acc
authRouter.post('/register', userRegister)

// forget pass
authRouter.post('/forget-password', userForgetPassword)

// reset pass
authRouter.post('/reset-password', userResetPassword)

// OTP verification
authRouter.post('/verify-email', userEmailVerify)

module.exports = authRouter
