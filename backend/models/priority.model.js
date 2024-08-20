const mongoose = require('mongoose');
const Schema = mongoose.Schema

const prioritySchema = new Schema({
    type: { type: Number, required: true, unique: true },
    message: { type: String, required: true, unique: true }
}, {
    collection: 'priorities'
})

const priorityModel = mongoose.model('priority', prioritySchema)

module.exports = priorityModel
