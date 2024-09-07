// mongoose
const noteModel = require('../models/note.model')
const stateModel = require('../models/state.model')

const noteCreate = async (req, res) => {
    const { title, content, tags, columnId, order } = req.body
    const { user } = req.user
    // check if user enters data
    if (!title) {
        return res.status(400).json({ error: true, message: 'Title is required!' })
    }
    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required!' })
    }

    try {
        const note = new noteModel({
            title,
            content,
            tags: tags || [],
            isPinned: false,
            userId: user._id,
            columnId,
            order,
        })
        await note.save()
        return res.status(200).json({
            message: 'Create note Successfully',
            note,
            error: false,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
}

const noteSearchAll = async (req, res) => {
    const { user } = req.user
    if (!user) {
        return res.status(404).json({
            error: true,
            message: 'No user found',
        })
    }

    try {
        const notes = await noteModel
            .find({ userId: user._id })
            .sort({ isPinned: -1 })
        if (!notes) {
            return res.status(400).json({
                error: true,
                message: 'No note found'
            })
        }

        return res.status(200).json({
            message: 'All notes retrieve Successfully',
            notes,
            error: false,
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
}

const noteEdit = async (req, res) => {
    const { title, content, tags, isPinned } = req.body
    const { user } = req.user
    const { noteId } = req.params

    if (!noteId) {
        return res.status(404).json({
            message: 'Cannot found the note required',
            error: true,
        })
    }
    try {
        const note = await noteModel.findOne({ _id: noteId, userId: user._id })

        // unhappy cases
        if (!note) {
            return res.status(404).json({ error: true, message: 'No note found' })
        }

        // insert value
        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags || note.tags;
        note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;

        await note.save()

        return res.status(200).json({
            message: 'update note successfully',
            note,
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

const noteDelete = async (req, res) => {
    const { user } = req.user
    const { noteId } = req.params

    if (!noteId) {
        return res.status(404).json({
            message: 'Cannot found the note required',
            error: true,
        })
    }

    try {
        const note = await noteModel.findOneAndDelete({ _id: noteId, userId: user._id })

        if (!note) {
            return res.status(400).json({ error: true, message: 'No note found' })
        }

        return res.status(200).json({
            message: 'Delete note Successfully',
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
}

const noteSearch = async (req, res) => {
    const { query } = req.query
    const { user } = req.user
    if (!query) {
        res.status(400).json({
            error: true,
            message: 'Search query is required!'
        })
    }

    try {
        const searchNotes = await noteModel
            .find({ userId: user._id })
            .populate('state')

        const matchingNotes = searchNotes.filter((note) => (
            note.title.match(new RegExp(query, 'i')) ||
            note.content.match(new RegExp(query, 'i')) ||
            note.tags.some(tag => tag.match(new RegExp(query, 'i'))) ||
            note.state?.message.match(new RegExp(query, 'i'))
        ))
        if (!matchingNotes || matchingNotes == undefined) {
            return res.status(400).json({ error: true, message: 'No note found' })
        }

        return res.status(200).json({
            message: 'Notes matchinng retrieved Successfully',
            matchingNotes,
            error: false,
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
}

module.exports = { noteEdit, noteCreate, noteSearchAll, noteDelete, noteSearch }