const express = require('express');
const auth = express.Router()

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

    // Update new password
    .patch('/reset/:id', authService.updateNewPassword)
        
module.exports = auth;