const express = require('express')
const path = require('path')

const { mongoose } = require('./server/config')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, "/public")))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(PORT, () => console.log(`SERVER: listening to port: ${PORT}`))