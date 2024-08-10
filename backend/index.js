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
const accountRouter = require('./routes/account.route')
const loginRouter = require('./routes/login.route')

// cors
const cors = require('cors')

// App services

app.use(
    cors({
        origin: '*'
    })
)

app.get("/", (req, res) => {
    res.json('hi')
})

// Account route
app.use('/api/account', accountRouter)

// Authentication route
app.use('/api/login', loginRouter)

// Notes route
app.use('/api/note', noteRouter)

app.listen(port, () => {
    console.log(`Server runs at http://localhost:${port}`)
})

module.exports = app