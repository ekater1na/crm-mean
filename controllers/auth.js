const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate) {
        // check password, user exist
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // token generation, equal passwords
            const token = jwt.sign({
                email: candidate.email,
                userid: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60});
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            res.status(401).json({
                // passwords don't match
                message: 'Passwords don\'t match. Try again'
            })
        }
    } else {
        // user doesn't exist, error
        res.status(404).json({
            message: 'User with that email not found'
        })
    }
}

module.exports.register = async function(req, res) {
    // email, password
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // user exist, return error
        res.status(409).json({
            message: 'That email is taken. Try another'
        })
    } else {
        // user will be created
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user  = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            res.status(201).json(user)
        } catch(e) {
            // catch error

        }
        

    }
}