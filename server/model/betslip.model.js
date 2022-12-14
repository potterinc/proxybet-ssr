const { Schema } = require('mongoose')
const { mongoose } = require('../config')

/** BET SLIPS */
const betSlipSchema = mongoose.Schema
const BetSlips = new betSlipSchema({
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
	dateIssued: {
		type: Date,
		default: Date.now
	}
})

/** PLACING OF BETS*/

const bettingSchema = mongoose.Schema
const Bet = new bettingSchema({
	userID: Schema.Types.ObjectId,
	stake: {
		type: Number,
		required: [true, 'Your stake is required']
	},
	gameSlip: Schema.Types.ObjectId,
	betDate: {
		type: Date,
		default: Date.now
	}
})

const Bets = mongoose.model('Bets', Bet)
const BettingSlip = mongoose.model('BetSlips', BetSlips)

module.exports = {
	Bets,
	BettingSlip
}