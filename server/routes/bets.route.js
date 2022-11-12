const express = require('express');
const { VERIFY_AUTH_TOKEN } = require('../controller/auth');
const betting = express.Router()



/** GAME SLIP */
betting
    .route('/')

    // view all bets
    .get((req, res) => {

    })

    // Place a bet
    .post((req, res) => {
        res.json({ status: 'Bet placed' })
    });

betting
    .route('/:id')
    // view one by id
    .get((req, res) => {
        res.json({ id: req.params.id })
    })

    // update game slip
    .patch((req, res) => {
        res.json({ id: req.params.id })
    })

    //delete game slip
    .delete((req, res) => {
        res.json({ id: req.params.id })
    })

//middelware
// code here...
module.exports = betting