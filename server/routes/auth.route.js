const express = require('express');
const auth = express.Router()
const jwt = require('jsonwebtoken')

// Route Controlers
const authService = require('../controller/auth')

auth

    // USER VERIFICATION
    .post('/', authService.VERIFY_EMAIL)

    // User Login
    .post('/login', authService.login)

    // New User Registration
    .post('/register', authService.newUser)

    // Password Reset
    .post('/reset', authService.VERIFY_EMAIL, authService.userResetCode)
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

module.exports = auth;