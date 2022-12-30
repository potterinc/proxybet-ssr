const express = require('express');
const wallet = express.Router()

    // view transaction history
    wallet.get('/', (req, res) => {
        res.json({ status: 'you have placed 0 bets this week' })
    })

    // fund wallet
    wallet.post('/fund', (req, res) => {
        res.json({ status: 'bet placed' })
    });

    //withdraw funds
    wallet.post('/withdraw', (req, res) => {
        res.json({ status: 'bet placed' })
    })


    //middelware
    // code here...

module.exports = wallet