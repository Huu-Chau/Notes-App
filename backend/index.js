require('dotenv').config()

// mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// express
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// express routes
const noteRouter = require('./routes/note.route')
const stateRouter = require('./routes/state.route')
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')

// cors
const cors = require('cors')
// carefull of this

// App services

app.use(
    cors({
        origin: '*',
        methods: 'GET,POST,PUT,PATCH,DELETE',
        credentials: true
    })
)

app.get("/ping", (req, res) => {
    res.json('bong')
})

// User route
app.use('/api/user', userRouter)

// Notes route
app.use('/api/note', noteRouter)

// State of note route
app.use('/api/state', stateRouter)

// Authentication route
app.use('/api/auth', authRouter)

app.listen(port, () => {
    console.log(`Server runs at http://localhost:${port}`)
})

module.exports = app