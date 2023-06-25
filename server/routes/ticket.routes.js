const express = require('express');
const { ticketSlip, ViewAdminTickets, getOneGameSlip } = require('../controller/bet.module');
const { VERIFY_AUTH_TOKEN } = require('../controller/auth');
const betSlip = express.Router()

/** BETTING ROUTE */
betSlip
    .route('/')

    // view all betslips
    .get(ViewAdminTickets)

    // Generate betting slip
    .post(VERIFY_AUTH_TOKEN, ticketSlip)

betSlip
    .route('/:id')

    // view one by id
    .get(VERIFY_AUTH_TOKEN, getOneGameSlip)

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