const { Schema, mongoose} = require('mongoose')
require('../config')

const paymentSchema = new Schema({
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
}, {timestamps:true})


const Transactions = mongoose.model('Transactions', paymentSchema, 'Transactions')

module.exports = Transactions