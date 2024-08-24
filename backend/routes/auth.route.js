// express
const express = require('express')
const authRouter = express.Router()

// import controller
const {
    userLogin,
    userRegister,
    userForgetPassword,
    userResetPassword
} = require('../controller/userController')

// login acc
authRouter.post('/login', userLogin)

// register acc
authRouter.post('/register', userRegister)

// forget pass
authRouter.post('/forget-password', userForgetPassword)

// reset pass
authRouter.post('/reset-password/:token', userResetPassword)

module.exports = authRouter
