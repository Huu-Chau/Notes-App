// mongoose
const userModel = require('../models/user.model')

const getUser = async (req, res) => {
    // const { fullName, email, status } = req.body
    const { user } = req.user

    try {
        const userFinder = await userModel.findOne({
            _id: user._id
        })

        if (!userFinder) {
            return res.status(440).json({ error: true, message: 'Cannot found user!' })
        }
        return res.status(200).json({
            status: userFinder.status,
            user: userFinder,
            message: 'Find user complete'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        })
    }
}

const updateUser = async (req, res) => {
    const { fullName, email, status } = req.body
    const { user } = req.user

    if (!user) {
        return res.status(404).json({
            message: 'Cannot found the users',
            error: true,
        })
    }
    try {
        const updateUser = await userModel.findOne({ _id: user._id })

        // insert value
        updateUser.fullName = fullName || updateUser.fullName;
        updateUser.email = email || updateUser.email;
        updateUser.status = status || updateUser.status;

        await updateUser.save()

        return res.status(200).json({
            message: 'update note successfully',
            updateUser,
            error: false,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        })
    }
}

module.exports = { getUser, updateUser }