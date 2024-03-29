if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const path = require('path')
const cors = require('cors')

const authentication = require('./server/routes/auth.routes')
const betSlip = require('./server/routes/ticket.routes')
const betting = require('./server/routes/bets.routes')
const wallet = require('./server/routes/wallet.routes')
const user = require('./server/routes/user.routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "/public/proxyBet")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: '*' }))

// Routes
app.use('/api/auth/', authentication)
app.use('/api/admin/ticket', betSlip)
app.use('/api/user/bet', betting)
app.use('/api/user/wallet', wallet)
app.use('/api/user/profile', user)

app.set('view engine', 'ejs')
require('./server/config')
app.listen(PORT, () => console.log(`SERVER: listening to port: ${PORT}`))
