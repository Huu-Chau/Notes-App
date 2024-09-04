// mongoose
const stateModel = require('../models/state.model')

const addNewState = async (req, res) => {
    const { order, title } = req.body
    const { user } = req.user

    try {
        const result = await stateModel.create({
            order,
            title,
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
}

const getStates = async (req, res) => {
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
}

const deleteState = async (req, res) => {
    const { stateId } = req.params
    if (!stateId || stateId == '') {
        return res.status(400).json({
            message: 'Invalid state',
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
}

const updateState = async (req, res) => {
    const { id, title } = req.body

    try {
        const stateMatch = await stateModel.findByIdAndUpdate({ _id: id }, {
            title,
        })
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
}

module.exports = { addNewState, getStates, deleteState, updateState }