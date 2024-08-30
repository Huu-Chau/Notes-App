const mongoose = require('mongoose');
const Schema = mongoose.Schema

const otpSchema = new Schema({
    createOn: { type: Date, default: new Date(Date.now() + 5 * 60 * 1000) },
    otp: { type: String },
    email: { type: String },
}, {
    collection: 'otps'
})

const otpModel = mongoose.model('otp', otpSchema)

module.exports = otpModel
