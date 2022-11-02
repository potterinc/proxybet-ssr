const express = require('express');
const auth = express.Router()
const jwt = require('jsonwebtoken')



auth
    // User Login
    .post('/login', authService.login)

    // New User Registration
    .post('/register', authService.newUser)


    .post('/reset', authService.VERIFY_AUTH_TOKEN, (req, res) => {
        // jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
        //     if (err) {
        //         res.sendStatus(403)
        //     } else {
        //         res.status(200).json({
        //             status: 'ok',
        //             authData
        //         })
        //     }
        // })
    })

    .post('/:email', (req, res) => {
        res.status(200).json({ status: 'ok' })
    })

// Route Controlers
const authService = require('../controller/auth')

module.exports = auth;