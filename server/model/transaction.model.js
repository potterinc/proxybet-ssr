const {mongoose} = require ('mongoose')

const paymentSchema = mongoose.Schema
const Payment = new paymentSchema({
    user_id: String,
    tx:{
        method: String, // Payment or Withdrawal
        amount: {
            type: Number,
            required: [true, 'Please specify the amount']
        },
        remarks: String, // Optional description
    }, 
    txID: String, // Transaction reference from Payment Merchant
    txStatus: String, // Payment status from Merchant
    transactionDate:{
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Payments', Payment)