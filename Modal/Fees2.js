const mongoose = require('mongoose');

const feeSessionSchema= new mongoose.Schema({
    sessionYear: String,
    courseNames: [{
        courseName: String,
        registrationFee: Number
    }]
});

const FeesSchema = new mongoose.Schema({
    sessions: [feeSessionSchema]
});

const Fees2 = mongoose.model('EntranceFees', FeesSchema);

module.exports = Fees2;
