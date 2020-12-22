require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'] // 'Bearer' + token
    // if we have authheader, return the token, return undefined otherwise
    const accessToken = authHeader && authHeader.split(' ')[1] // get accessToken only
    if(accessToken == null) return res.sendStatus(401)
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) {
            console.log(err);
            return res.sendStatus(403)
        }
        req.payload = payload
        next()
    })
}