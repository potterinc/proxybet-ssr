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
                delete user.password

                res.status(201).json({
                    message: "Registration Successful",
                    status: true,
                    token: NEW_AUTH_TOKEN(user, process.env.ACCESS_TOKEN_SECRET)
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
                else {
                    res.status(405).json({
                        // message: "ERROR: Email or phone already exists in our "
                        message: e.message
                    })
                }
                // if (e.name = 'MongoServerError') {
                //     if (e.keyValue['email']) {
                //         res.status(405).json({
                //             message: `${e.keyValue.email} already exist`
                //         })
                //     }
                //     if (e.keyValue['phone']) {
                //         res.status(405).json({
                //             message: `${e.keyValue.phone} already exist`
                //         })
                //     }
                // }


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
                if (bcrypt.compareSync(password, user.password)) {
                    delete user.password

                    res.status(200).json({
                        message: "Login Successful",
                        token: NEW_AUTH_TOKEN(user, process.env.ACCESS_TOKEN_SECRET)
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


/**
 * 
 * @param {ArrayBuffer | Object } payload
 * @param {String} key 
 * @returns String
 */
const NEW_AUTH_TOKEN = (payload, key) => {
    return jwt.sign({payload}, key, {expiresIn: '7d'})
}


// Authentication Middleware function
const VERIFY_AUTH_TOKEN = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')
        req.token = bearerToken[1]
        next()
    } else {
        res.sendStatus(403)
    }
}

module.exports = { newUser, login, NEW_AUTH_TOKEN, VERIFY_AUTH_TOKEN }