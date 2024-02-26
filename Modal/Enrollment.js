const mongoose = require('mongoose')


// Define MongoDB schema for enrollment
const enrollmentSchema = new mongoose.Schema({
    collegeCode: String,
    courseCode: String,
    branchCode: String,
    level: String,
    sequenceNumber: { type: Number, default: 1 }
  });
  
const Enrollment = mongoose.model("Enrollments",enrollmentSchema )


module.exports = Enrollment;