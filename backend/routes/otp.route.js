// express
const express = require('express')
const otpRouter = express.Router()

const { otpCreate, otpSend } = require('../controller/otpController')

otpRouter.use(express.json())

otpRouter.post('', otpCreate)

otpRouter.post('send-otp', otpSend)

module.exports = otpRouter