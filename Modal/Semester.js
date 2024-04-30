const mongoose = require('mongoose');

const SemesterSubjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
    },
    subjectCode: {
        type: String,
    },
    subCount: {
        type: String,
    },
    paperCode: {
        type: String,
    },
    compopt:{
        type: String,
    },
    subSeq:{
        type: String,
    },
    assessments: {
        theory: {
            type: Boolean,
            default: false,
        },
        termQuiz: {
            type: Boolean,
            default: false,
        },
        practical: {
            type: Boolean,
            default: false,
        },
        lab: {
            type: Boolean,
            default: false,
        },

    },
});

const SemesterSchemeSchema = new mongoose.Schema({
    semesterNumber: {
        type: Number,
    },
     courseType: {
        type: String,
    },
    courseName: {
        type: String,
    },
    courseBranch: {
        type: String,
    },
   
    subjects: [SemesterSubjectSchema],
},
 { timestamps: true });

const SemesterScheme = mongoose.model('SemesterScheme', SemesterSchemeSchema);

module.exports = SemesterScheme;
