const express = require('express');
const betSlip = express.Router()

/** BETTING ROUTE */
betSlip
    .route('/')

    // view all betslips
    .get((req, res) => {
        res.json({ status: 'you have placed 0 bets this week' })
    })

    // place bet
    .post((req, res) => {
        res.json({ status: 'bet placed' })
    });

betSlip
    .route('/:id')

    // view one by id
    .get((req, res) => {
        res.json({ id: req.params.id })
    })

    // update bet slip
    .patch((req, res) => {
        res.json({ id: req.params.id })
    })
    
    //delete bet slip
    .delete((req, res) => {
        res.json({ id: req.params.id })
    })

    //middelware
    // code here...

module.exports = betSlip