require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')

const authentication = require('./server/routes/auth.route')
const betSlip = require('./server/routes/ticket.route')
const betting = require('./server/routes/bets.route')
const wallet = require('./server/routes/wallet.route')
const user = require('./server/routes/user.route')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, "/public/proxyBet")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({origin: '*'}))

// Routes
app.use('/api/auth/', authentication)
app.use('/api/admin/ticket', betSlip)
app.use('/api/user/bet', betting)
app.use('/api/user/wallet', wallet)
app.use('/api/user/profile', user)

app.set('view engine', 'ejs')
require('./server/config')
app.listen(PORT, () => console.log(`SERVER: listening to port: ${PORT}`))