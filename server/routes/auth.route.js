const express = require('express');
const auth = express.Router()

// Route Controlers
const { VERIFY_EMAIL,
    login,
    newUser,
    userResetCode,
    updateNewPassword, 
    authResetToken} = require('../controller/auth')

auth

    // User Login
    .post('/login', login)

    // New User Registration
    .post('/register', newUser)

    // Password Reset
    .post('/reset', VERIFY_EMAIL, userResetCode)

    .post('/verify-token', authResetToken)
    
    // Update new password
    .patch('/reset', updateNewPassword)

module.exports = auth;