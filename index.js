require('dotenv').config()
const express = require('express')
const path = require('path')

const authentication = require('./server/routes/auth.route')
const betSlip = require('./server/routes/betslip.route')
const gameSlip = require('./server/routes/gameslip.route')
const wallet = require('./server/routes/wallet.route')
const user = require('./server/routes/user.route')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/api/auth/', authentication)
app.use('/api/admin/ticket', gameSlip)
app.use('/api/user/bet', betSlip)
app.use('/api/user/wallet', wallet)
app.use('/api/user/account', user)

app.set('view engine', 'ejs')
require('./server/config')
app.listen(PORT, () => console.log(`SERVER: listening to port: ${PORT}`))