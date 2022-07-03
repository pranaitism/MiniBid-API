const jsonwebtoken = require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send("Access denied")
    }
    try {
        const verifyToken = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user = verifyToken;

        next()
    } catch (err) {
        return res.status(401).send({message: "invalid token"})
    }
}

module.exports = auth