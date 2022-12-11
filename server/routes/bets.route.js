const express = require('express');
const { VERIFY_AUTH_TOKEN } = require('../controller/auth');
const { viewBets, placeBet } = require('../controller/bet.module');
const betting = express.Router()



/** GAME SLIP */
betting
    .route('/')

    // view all bets
    .get(VERIFY_AUTH_TOKEN, viewBets)

    // Place a bet
    .post(VERIFY_AUTH_TOKEN, placeBet)

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