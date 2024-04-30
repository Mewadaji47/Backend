const mongoose = require('mongoose')
const feeSchema = new mongoose.Schema({

    admissionSession: String,
    courseName: String,
    courseBranch:String,
    enrollmentFee: Number,
    registrationFee: Number,

});
  
 
const Fees = mongoose.model('Fee', feeSchema);

  
module.exports = Fees;