require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongooseError } = require('mongoose');
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
                if (e.name == 'ValidationError') {
                    if (e.errors['email']) {
                        res.status(400).json({
                            message: e.errors['email'].message
                        })
                    }
                    if (e.errors['phone']) {
                        res.status(400).json({
                            message: e.errors['phone'].message
                        })
                    }
                }
                if (e.name = 'MongoServerError') {
                    if (e.keyValue['email']) {
                        res.status(405).json({
                            message: `${e.keyValue.email} already exist`
                        })
                    }
                    if (e.keyValue['phone']) {
                        res.status(405).json({
                            message: `${e.keyValue.phone} already exist`
                        })
                    }
                }


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

    User.findOne({ email })
        .then(user => {
            if (user) {
                console.log(password);
                console.log(user.password);
                if (bcrypt.compareSync(password, user.password)) {
                    delete user.password

                    const authToken = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET)

                    res.status(200).json({
                        message: "Login Successful",
                        authToken
                    })
                } else {
                    res.status(406).json({
                        message: "TRY AGAIN: Password Invalid!"
                    })
                }
            }
            else {
                res.status(400).json({
                    message: `ERROR: ${email} does not exist`
                })
            }
        })
}

module.exports = { newUser, login }