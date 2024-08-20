// express
const express = require('express')
const noteRouter = express.Router()

// mongoose
const noteModel = require('../models/note.model')
const stateModel = require('../models/state.model')

// jwt
const { authenToken } = require('../utilities')

// add notes
noteRouter.post('', authenToken, async (req, res) => {
    const { title, content, tags, state } = req.body
    const { user } = req.user
    // check if user enters data
    if (!title) {
        return res.status(400).json({ error: true, message: 'Title is required!' })
    }

    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required!' })
    }
    const stateName = await stateModel.findOne({ message: state })
    console.log(stateName._id)
    try {
        const note = new noteModel({
            title,
            content,
            tags: tags || [],
            userId: user._id,
            state: stateName._id,
            isPinned: false
        })
        console.log(note)
        await note.save()

        return res.json({
            message: 'Create note Successfully',
            note,
            error: false,
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
})

// get all notes
noteRouter.get('', authenToken, async (req, res) => {
    const { user } = req.user
    try {
        const notes = await noteModel
            .find({ userId: user._id })
            .sort({ isPinned: -1 })
            .populate('state')
        if (!notes) {
            return res.status(400).json({
                error: true,
                message: 'No note found'
            })
        }

        return res.json({
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
})

// edit notes
noteRouter.patch('/:noteId', authenToken, async (req, res) => {
    const { title, content, tags, state, isPinned } = req.body
    const { user } = req.user
    const { noteId } = req.params

    // check if user enters data
    if (!title && !content && !tags && !state && !isPinned) {
        return res.status(400).json({ error: true, message: 'No changes provided' })
    }

    try {
        const [stateId, note] = await Promise.all([
            stateModel.findOne({ message: state }),
            noteModel.findOne({ _id: noteId, userId: user._id })
        ]);

        if (!note) {
            return res.status(404).json({ error: true, message: 'No note found' })
        }

        note.content = content || note.content;
        note.tags = tags || note.tags;
        note.isPinned = !note.isPinned || isPinned
        note.state = stateId._id || note.state;

        await note.save()

        return res.json({
            message: 'Note update Successfully',
            note,
            error: false,
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
        })
    }
})

// delete notes
noteRouter.delete('/:noteId', authenToken, async (req, res) => {
    const { user } = req.user
    const { noteId } = req.params

    try {
        const note = await noteModel.findOneAndDelete({ _id: noteId, userId: user._id })

        if (!note) {
            return res.status(400).json({ error: true, message: 'No note found' })
        }

        // await note.deleteOne({ _id: noteId, userId: user._id })

        return res.json({
            message: 'Delete note Successfully',
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
})

// search notes
noteRouter.get('/search', authenToken, async (req, res) => {
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

        return res.json({
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
})

module.exports = noteRouter