const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    // razorpayPaymentId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    status: { type: String, enum: ['created', 'success', 'failed'], default: 'created' },
    amount: { type: Number, required: true }
  }, { timestamps: true });
  
  const Transaction = mongoose.model('Transaction', transactionSchema);
  
  module.exports = Transaction;
  