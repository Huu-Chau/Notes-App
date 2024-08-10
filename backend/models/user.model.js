const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: { type: String },
    email:    { type: String },
    password: { type: String },
    createOn: { type: Date, default: new Date().getTime() }
},{
    collection: 'users'
})

const userModel = mongoose.model('User', userSchema) 

module.exports = userModel
