// express
const express = require('express')
const stateRouter = express.Router()

// mongoose
const stateModel = require('../models/state.model')

// jwt authen
const { authenToken } = require('../utilities')

stateRouter.use(express.json())

// add new state code
stateRouter.post('', authenToken, async (req, res) => {
    const { state } = req.body
    const { user } = req.user

    if (!state) {
        return res.status(400).json({
            message: 'State is required!',
            error: true,
        })
    }

    try {
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

        return res.status(200).json({
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
stateRouter.get('', authenToken, async (req, res) => {
    const { user } = req.user
    try {
        const states = await stateModel.find({
            $or: [
                { userId: user._id },
                { userId: { $exists: false } },
            ]
        })

        return res.status(200).json({
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
        return res.status(200).json({
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
