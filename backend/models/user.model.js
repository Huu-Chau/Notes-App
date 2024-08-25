const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    createOn: { type: Date, default: new Date().getTime() },
    status: { type: String, default: 'unverified' }
}, {
    collection: 'users'
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel
