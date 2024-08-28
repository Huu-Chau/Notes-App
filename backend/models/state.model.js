const mongoose = require('mongoose');
const Schema = mongoose.Schema

const stateSchema = new Schema({
    order: { type: Number },
    title: { type: String, required: true },
    color: { type: String, default: 'transparent' },
    userId: { type: String, required: true },
}, {
    collection: 'states'
})

const stateModel = mongoose.model('state', stateSchema)

module.exports = stateModel
