const mongoose = require('mongoose')
const PaymentSchema = new mongoose.Schema({
    orderId: String,
    txnId: String,
    bankTxnId: String,
    paymentMode: String,
    txnDate: String,
    txnAmount: String,
    responseMessage: String,
    status: String,
   
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    name:String,
    randomId:String,
    email:String,
    mobile:String,
    fathersname:String,
    mothersname:String
  });
  
 
const Payment = mongoose.model('payment', PaymentSchema);

  
module.exports = Payment;