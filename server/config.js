const { default: mongoose } = require("mongoose");

mongoose.connect('mongodb://localhost:27017/proxyBet', {
	useNewUrlParser: true
})
mongoose.connection
	.on('error', (err) => {
		console.log(err)
		mongoose.disconnect()
	})
	.once('connected', () => console.log(`DATASOURCE: ${mongoose.connections[0]._connectionString}`))

module.exports = { mongoose }