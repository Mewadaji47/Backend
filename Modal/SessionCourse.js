const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true 
  },
});

const CourseNameSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true 
  },
  branches: [BranchSchema]
});

const CourseTypeSchema = new mongoose.Schema({
   admissionSession:{
     type:String,
   },
 
   courseType: {
    type: String,
    enum: ['UG', 'PG', 'Diploma'],
    required: true
  },
  courseNames: [CourseNameSchema]
});

const Course2 = mongoose.model('SessionWiseCourse', CourseTypeSchema);

module.exports = Course2;
