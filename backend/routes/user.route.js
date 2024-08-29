// express
const express = require('express')
const userRouter = express.Router()


// authen
const { authenToken } = require('../utilities')
const { updateUser, getUser } = require('../controller/userController')

userRouter.use(express.json())

// get account data
userRouter.get('', authenToken, getUser)

// update account
userRouter.patch('', authenToken, updateUser)

module.exports = userRouter
