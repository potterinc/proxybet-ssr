const express = require('express');
const userModel = require('../model/user.model');
const authentication = express.Router()

authentication
    .post('/login', (req, res) => {
        res.status(200).json({ status: 'ok' })
    })
    .post('/register', (req, res) => {
        res.status(201).json({ status: 'ok' })
    })
    .post('/:email', (req, res) => {
        
        res.status(200).json({email: req.params.email, status: 'ok'})
    })
    .post('/reset', (req, res)=>{
        res.status(200).json({status: 'ok'})
    })

module.exports = authentication;