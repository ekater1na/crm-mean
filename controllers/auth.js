const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports.login = function(req, res) {
   
}

module.exports.register = async function(req, res) {
    // email, password
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        //user exist, return error
        res.status(409).json({
            message: 'That email is taken. Try another'
        })
    } else {
        //user will be created
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