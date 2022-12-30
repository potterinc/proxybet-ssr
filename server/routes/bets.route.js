const express = require('express');
const { VERIFY_AUTH_TOKEN } = require('../controller/auth');
const { viewBets, placeBet, updateGameSlip } = require('../controller/bet.module');
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
   .patch(VERIFY_AUTH_TOKEN, updateGameSlip)

   // Cancel bet
   .delete(VERIFY_AUTH_TOKEN)

//middelware
// code here...
module.exports = betting