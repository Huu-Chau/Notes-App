// express
const express = require('express')
const noteRouter = express.Router()

// jwt
const { authenToken } = require('../utilities')

// noteController
const { noteEdit, noteCreate, noteSearchAll, noteDelete, noteSearch } = require('../controller/noteController')

noteRouter.use(express.json())

// add notes
noteRouter.post('', authenToken, noteCreate)

// get all notes
noteRouter.get('', authenToken, noteSearchAll)

// edit notes
noteRouter.patch('/:noteId', authenToken, noteEdit)

// delete notes
noteRouter.delete('/:noteId', authenToken, noteDelete)

// search notes
noteRouter.get('/search', authenToken, noteSearch)

module.exports = noteRouter