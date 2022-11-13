const express = require('express');
const auth = express.Router()

// Route Controlers
const { VERIFY_EMAIL,
    login,
    newUser,
    userResetCode,
    updateNewPassword } = require('../controller/auth')

auth

    // User Login
    .post('/login', login)

    // New User Registration
    .post('/register', newUser)

    // Password Reset
    .post('/reset', VERIFY_EMAIL, userResetCode)

    // Update new password
    .patch('/reset/:id', updateNewPassword)

module.exports = auth;