const mongoose = require('mongoose');


const branchSchema = new mongoose.Schema({
  name: { type: String},
  code: {type: String, unique:false}
});

const Branch = mongoose.model('Branches', branchSchema);

// Institute Schema
const instituteSchema = new mongoose.Schema({
  name: { type: String },
  
  code: { type: String  },
});

const Institute = mongoose.model('Institutes', instituteSchema);

// Course Schema
const courseSchema = new mongoose.Schema({
  name: { type: String },
  code: { type: String},
  branches: [branchSchema],
  institute: instituteSchema,
});


const NCourse = mongoose.model('newCoursescode', courseSchema);

module.exports = NCourse;