const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

function authenToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401).json({ message: 'No token provided, redirect to login' });
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401).json({ message: 'No token provided, redirect to login' });
        }
        req.user = user
        next()
    })
}

async function hashPassword(password) {
    // encode the password
    const saltRounds = parseInt(process.env.SALT_ROUND); // You can increase this for more security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // check if it exists
    if (!hashedPassword) {
        return res.json({ error: true, message: 'Something went wrong!! No hash found!' })
    }

    return hashedPassword
}

async function comparePassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}

module.exports = { authenToken, hashPassword, comparePassword }