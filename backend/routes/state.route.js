// express
const express = require('express')
const stateRouter = express.Router()

// mongoose
const stateModel = require('../models/state.model')

// jwt authen
const { authenToken } = require('../utilities')

// add new state code
stateRouter.post('', authenToken, async (req, res) => {
    const { state, type } = req.body
    const { user } = req.user

    if (!state) {
        return res.status(400).json({
            message: 'State is required!',
            error: true,
        })
    }

    try {
        console.log(`user id: ${user._id}`)

        // Find the highest existing type value
        const lastState = await stateModel.findOne({}).sort({ type: -1 });
        const newType = lastState ? lastState.type + 1 : 1;

        const result = await stateModel.create({
            type: newType,
            message: state,
            color: 'red',
            userId: user._id,
        });

        if (!result) {
            return res.status(401).json({
                error: true,
                message: 'cannot post state',
            })
        }
        console.log('result: ', result)

        return res.json({
            message: 'Add state Successfully',
            result,
            error: false,
        })
    } catch (error) {
        console.error('Error during state creation:', error)
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true
        })
    }
})

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


module.exports = stateRouter
