const express = require('express')
const usersRouter = express.Router();
const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/userValidations')
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const verify = require('../verifyToken')
//User registration
usersRouter.post('/register', async (req, res) => {
    //validations 1 for user input
    const {error} = registerValidation(req.body)
    if (error) {
        return res.status(400).send({message: error['details'][0]["message"]})
    }

    //Validation 2 to check if user exists
    const userExist = await User.findOne({email: req.body.email})
    if (userExist) {
        return res.status(400).send('User already exist')
    }

    /// Create hashed representation of users password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)
    //code to save user to DB
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        city:req.body.city
    })
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (err) {
        res.status(400).send({message: err})

    }
})

//user login
usersRouter.post('/login', async (req, res) => {

    // Validation 1 to check user input
    const {error} = loginValidation(req.body)
    if (error) {
        return res.status(400).send({message: error['details'][0]['message']})
    }

    // Validation 2 to check if user exists
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        return res.status(400).send({message: 'User does not exist'})
    }

    // Validation 3 to check user password
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if (!passwordValidation) {
        return res.status(400).send({message: 'Password is wrong'})
    }

    //Generate auth token
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    //console.log(token)
    res.header('auth-token', token).send({'auth-token': token})
})

usersRouter.get('/', verify,async (req, res) => {
    try {
        const getUser = await User.find().limit(10)
        res.send(getUser)
    } catch (err) {
        res.status(404).send({message: err})
    }
})


module.exports = usersRouter;