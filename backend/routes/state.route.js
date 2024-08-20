// express
const express = require('express')
const stateRouter = express.Router()

// mongoose
const stateModel = require('../models/state.model')

// get all state codes
stateRouter.get('', async (req, res) => {
    try {
        const states = await stateModel.find({})
        if (states.length === 0) {
            return res.status(400).json({
                message: 'No state found',
                error: true,
            })
        }
        return res.json({
            message: 'State found successfully',
            error: false,
            states
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        })
    }
})

// delete one state code
stateRouter.delete('/:stateId', async (req, res) => {
    const { stateId } = req.params
    console.log(stateId)
    if (!stateId || stateId == '') {
        return res.status(400).json({
            message: 'Please enter valid state',
            error: true,
        })
    }
    try {
        const stateMatch = await stateModel.findOneAndDelete({ _id: stateId })
        if (!stateMatch) {
            return res.status(404).json({
                message: 'No state found',
                error: true,
            })
        }
        return res.json({
            message: 'State found successfully',
            stateMatch,
            error: false,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        })
    }
})

// add new state code
stateRouter.post('', async (req, res) => {
    const { state, type, color } = req.body
    if (!state) {
        return res.status(400).json({ message: 'State is required!', error: true })
    }

    try {
        const result = await stateModel.create({
            type: type,
            message: state,
            color: color || 'red',
        })

        return res.json({
            message: 'Add state Successfully',
            error: false,
            result
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true
        })
    }
})


module.exports = stateRouter
