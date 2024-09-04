// express
const express = require('express')
const stateRouter = express.Router()


// jwt authen
const { authenToken } = require('../utilities')
const { deleteState, getStates, addNewState, updateState } = require('../controller/stateController')

stateRouter.use(express.json())

// add new state code
stateRouter.post('', authenToken, addNewState)

// get all state codes
stateRouter.get('', authenToken, getStates)

// update state code
stateRouter.put('', authenToken, updateState)

// delete state code
stateRouter.delete('/:stateId', deleteState)


module.exports = stateRouter
