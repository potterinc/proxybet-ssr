const express = require('express');
const gameSlip = express.Router()

/** GAME SLIP */
gameSlip
    .route('/')

    // view all gamesslip
    .get((req, res) => {
        res.json({ status: 'you have placed 0 bets this week' })
    })

    // add new slip
    .post((req, res) => {
        res.json({ status: 'Ticket saved' })
    });

gameSlip
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
module.exports = gameSlip