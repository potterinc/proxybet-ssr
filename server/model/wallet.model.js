const { Schema } = require('mongoose')
const { mongoose } = require('../config')

const paymentSchema = mongoose.Schema
const Payments = new paymentSchema({
	userID: Schema.Types.ObjectId,
	tx: {
		method: String, // Payment or Withdrawal
		amount: {
			type: Number,
			required: [true, 'Please specify the amount']
		},
		remarks: String, // Optional description
	},
	txID: String, // Transaction reference from Payment Merchant
	txStatus: String, // Payment status from Merchant
	transactionDate: {
		type: Date,
		default: Date.now
	}
})

// WALLET

const walletSchema = mongoose.Schema;
const Balance = new walletSchema({
	userID: Schema.Types.ObjectId,
	balance: {
		type: Number,
		default: 0
	},
	lastUpdated: {
		type: Date,
		default: Date.now
	}
})


const Transactions = mongoose.model('Transactions', Payments)
const Wallet = mongoose.model('Wallet', Balance)

module.exports = { Transactions, Wallet }