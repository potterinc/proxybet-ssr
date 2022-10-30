const express = require('express');
const auth = express.Router()

const authService = require('../controller/auth.service')

// User Login
auth
    .post('/login', authService.login)

    // New User Registration
    .post('/register', authService.newUser)


    .post('/reset', (req, res) => {
        res.status(200).json({ status: 'ok' })
    })

    .post('/:email', (req, res) => {
        res.status(200).json({ status: 'ok' })
    })
//Authentication middleware


module.exports = auth;