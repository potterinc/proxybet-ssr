const { Schema, mongoose } = require('mongoose')
require('../config')

/** BET SLIPS */
const betSlipSchema = mongoose.Schema
const BetSlips = new betSlipSchema({

	games: [Schema.Types.Mixed],

	// 	HTeam: {
	// 		type: String,
	// 		required: true
	// 	},
	// 	ATeam: {
	// 		type: String,
	// 		required: true
	// 	},
	// 	betOption: {
	// 		type: String,
	// 		required: true
	// 	},
	// 	betOdds: {
	// 		type: Number,
	// 		required: true
	// 	},
	// 	gameStatus: {
	// 		type: String,
	// 		required: true
	// 	},
	// 	matchResult: Boolean,
	// 	startTime: String
	// }],
	slipStatus: {
		type: String,
		default: 'Open'
	},
	userStakeLimit: Number,
	maximumStake: Number,
	result: String,
	ticketBonus: Number,
	totalOdds: Number
}, {timestamps: true, versionKey: false})


/** PLACING OF BETS*/

const bettingSchema = mongoose.Schema
const Bet = new bettingSchema({
	user: Schema.Types.ObjectId,
	stake: {
		type: Number,
		required: [true, 'Your stake is required'],
		min: [100, 'Stake is too small']
	},
	gameSlip: {
		type: Schema.Types.ObjectId,
		ref: 'BetSlips'
	}
},{timestamps:true})

const Bets = mongoose.model('Bets', Bet)
const BettingSlip = mongoose.model('BetSlips', BetSlips)


module.exports = {
	Bets,
	BettingSlip
}