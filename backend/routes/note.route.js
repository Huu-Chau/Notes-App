// express
const express = require('express')
const noteRouter = express.Router()

// mongoose
const noteModel = require('../models/note.model')

// jwt
const { authenToken } = require('../utilities')

// add notes
noteRouter.post('', authenToken, async (req, res) => {
    const { title, content, tags } = req.body
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
            userId: user._id,
            isPinned: false
        })
        await note.save()

        return res.json({
            error: false,
            note,
            message: 'Create note Successfully'
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
        const notes = await noteModel.find({ userId: user._id }).sort({ isPinned: -1 })
        if (!notes) {
            return res.status(400).json({ error: true, message: 'No note found' })
        }

        return res.json({
            error: false,
            notes,
            message: 'All notes retrieve Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
})

// edit notes
noteRouter.put('/:noteId', authenToken, async (req, res) => {
    const { title, content, tags } = req.body
    const { user } = req.user
    const { noteId } = req.params

    // check if user enters data
    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: 'No changes provided' })
    }
    try {
        const note = await noteModel.findOne({ _id: noteId, userId: user._id })

        if (!note) {
            return res.status(400).json({ error: true, message: 'No note found' })
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;

        await note.save()

        return res.json({
            error: false,
            note,
            message: 'Note update Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
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

        await note.deleteOne({ _id: noteId, userId: user._id })

        return res.json({
            error: false,
            message: 'Delete note Successfully'
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
        const matchingNotes = await noteModel.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, 'i') } },
                { content: { $regex: new RegExp(query, 'i') } }
            ]
        })

        if (!matchingNotes) {
            return res.status(400).json({ error: true, message: 'No note found' })
        }

        return res.json({
            error: false,
            matchingNotes,
            message: 'Notes matchinng retrieved Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
})

// update isPinned Value
noteRouter.put('/:noteId/pin', authenToken, async (req, res) => {
    const { isPinned } = req.body
    const { user } = req.user
    const { noteId } = req.params
    try {
        const note = await noteModel.findOne({ _id: noteId, userId: user._id })

        if (!note) {
            return res.status(400).json({ error: true, message: 'No note found' })
        }

        note.isPinned = isPinned;

        await note.save()

        return res.json({
            error: false,
            note,
            message: 'Pin update Successfully'
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        })
    }
})

module.exports = noteRouter