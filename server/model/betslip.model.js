const { mongoose } = require('../config')

const BetSlipSchema = mongoose.Schema

const betSlipModel = new BetSlipSchema({
	game: [{
		HTeam: {
			type: String,
			required: true
		},
		ATeam: {
			type: String,
			required: true
		},
		betOption: {
			type: String,
			required: true
		},
		betOdds: {
			type: Number,
			required: true
		},
		status: {
			type: String,
			required: true
		},
		result: Boolean,
		startTime: {
			type: Date,
			required: true
		}
	}],
	status: {
		type: String,
		default: 'Open'
	},
	userStakeLimit: Number,
	maximumStake: Number,
	result: Boolean,
	totalOdds: Number,
	date: {
		iat: {
			type: Date,
			default: Date.now
		},
		exp: Date
	}
})

module.exports = mongoose.model('BetSlips', betSlipModel);