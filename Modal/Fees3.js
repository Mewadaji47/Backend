const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    branchName: String,
    registrationFee: Number 
});

const courseSchema = new mongoose.Schema({
    courseName: String,
    branches: [branchSchema] 
});

const feeSessionSchema = new mongoose.Schema({
    sessionYear: String,
    courses: [courseSchema]
});

const FeesSchema = new mongoose.Schema({
    sessions: [feeSessionSchema]
});

const Fees3 = mongoose.model('EPraveshFees', FeesSchema);

module.exports = Fees3;

