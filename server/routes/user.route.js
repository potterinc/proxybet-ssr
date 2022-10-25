const express = require('express');
const user = express.Router()

/** PROFILE MANAGEMENT */

// view profile
user.get((req, res) => {
        res.json({ status: 'you have placed 0 bets this week' })
    })

// UPDATE PROFILE   
user.patch('/:id', (req, res) => {
    res.json({ status: 'bet placed' })
});

//middelware
// code here...

module.exports = user