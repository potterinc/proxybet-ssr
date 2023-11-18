const mongoose = require("mongoose");

mongoose.connect(process.env.SERVER_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
mongoose.connection
	.on('error', err => {
		console.log(err)
		mongoose.disconnect()
	})
	.once('connected', () => console.log(`DATASOURCE: ${mongoose.connections[0]._connectionString}`));