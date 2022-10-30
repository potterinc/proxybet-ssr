require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');


const newUser = (req, res) => {
    bcrypt.hash(req.body.password, 3, (err, encryptedPassword) => {
        if (err) {
            res.status(400).json({
                message: err
            })
        }
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: encryptedPassword,
            phone: req.body.phone,
            role: process.env.DEFAULT_ROLE
        });
        newUser.save()
            .then(user => {
                res.status(201).json({
                    message: "Registration Successful"
                })
            })
            .catch(e => {
                res.status(400).json({
                    message: e.message
                })
            })
    })
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const login = (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.find({ email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        res.status(400).json({
                            message: err
                        })
                    }
                    if (result) {
                        delete user.password

                        const authToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expriresIn: '1d'})
                        res.status(200).json({
                            message: "Login Successful",
                            authToken
                        })
                        setTimeout(() => {
                            console.log('Redirecting...')
                        }, 3000)
                    } else {
                        res.status(400).json({
                            message: "TRY AGAIN: Password Invalid!"
                        })
                    }
                })
            }
            else {
                res.status(400).json({
                    message: `ERROR: ${email} does not exist`
                })
            }
        })
}

module.exports = { newUser, login }