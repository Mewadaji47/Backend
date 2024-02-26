const mongoose = require('mongoose');


const branchSchema = new mongoose.Schema({
  name: { type: String},
  code: {type: String, unique:false}
});

const Branch = mongoose.model('Branch', branchSchema);

// Institute Schema
const instituteSchema = new mongoose.Schema({
  name: { type: String },
  code: { type: String  },
});

const Institute = mongoose.model('Institute', instituteSchema);

// Course Schema
const courseSchema = new mongoose.Schema({
  coursename: { type: String },
  coursecode: { type: String},
  branches: [branchSchema],
  institute: instituteSchema,
});


const Course = mongoose.model('Coursescode', courseSchema);

module.exports = Course;