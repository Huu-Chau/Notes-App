const mongoose = require('mongoose');
const Schema = mongoose.Schema

const stateSchema = new Schema({
    type: { type: Number },
    message: { type: String, required: true },
    color: { type: String, default: 'red' },
    userId: { type: String, required: true },
}, {
    collection: 'states'
})

const stateModel = mongoose.model('state', stateSchema)

module.exports = stateModel
