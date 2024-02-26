const mongoose = require('mongoose');
const SemesterScheme = require('./Semester');

const AddressSchema = new mongoose.Schema({
 
    address1: String,
    address2: String,
    country: String,
    state: String,
    district: String,
    pinCode: String,
 
});

const ProfessionalDetailsSchema = new mongoose.Schema({
  Handicapped: String,
  Medium: String,

  ScholarshipRequired: String,
  FathersOccupation: String,
  MothersOccupation: String,
  FathersIncome: String,
  MothersIncome: String,
  SamagraId: String,
  AadharNumber: String,
  ParentMobile: String,
});


const AcademicDetailsSchema = new mongoose.Schema({
  tenthSchool: String,
  tenthPassingYear: String,
  tenthRollNo: String,
  tenthBoard: String,
  tenthExamType: String,
  tenthMarksObtain: String,
  tenthMaxMarks: String,
  tenthPercentage: String,
  twelfthSchool: String,
  twelfthPassingYear: String,
  twelfthRollNo: String,
  twelfthBoard: String,
  twelfthExamType: String,
  twelfthMarksObtain: String,
  twelfthMaxMarks: String,
  twelfthPercentage: String,
  graduationSchool: String,
  graduationPassingYear: String,
  graduationRollNo: String,
  graduationBoard: String,
  graduationExamType: String,
  graduationMarksObtain: String,
  graduationMaxMarks: String,
  graduationPercentage: String,
  postGraduationSchool: String,
  postGraduationPassingYear: String,
  postGraduationRollNo: String,
  postGraduationBoard: String,
  postGraduationExamType: String,
  postGraduationMarksObtain: String,
  postGraduationMaxMarks: String,
  postGraduationPercentage: String,
  otherSchool: String,
  otherPassingYear: String,
  otherRollNo: String,
  otherBoard: String,
  otherExamType: String,
  otherMarksObtain: String,
  otherMaxMarks: String,
  otherPercentage: String,
});
const DocumentSchema = new mongoose.Schema({
  applicantPhoto:String,
  applicantSignature:String,
  aadharCard:String,
  marksheet10th:String,
  marksheet12th:String,
  undergraduateCertificate:String,
  postgraduateCertificate:String,
  domicileCertificate:String,
  transferCertificate:String,
  incomeCertificate:String,
  migrationCertificate:String,
  otherCertificate:String
});


const StudentSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
     type:String,
     required:true
  },
  academicDetails: AcademicDetailsSchema,
  address: AddressSchema,
  professional:ProfessionalDetailsSchema,
  dob:{
    type:Date,
    required:true
  } ,
  randomId :{
    type:String,
  },
  IsEnrollGenerated:{
    type:Boolean,
    default:false
  },
  randomPassword:{
    type:String,
  },
  courseName:{
    type:String,
  },
  courseType:{
    type:String,
  },
  courseBranch:{
    type:String
  },
  fathersname:{
    type:String,
  },
  mothersname:{
    type:String,
  },
  qualifyingEntranceExam:{
    type:String
  },
  mobile:{
    type:String,

  },
  domicile:{
    type:String,

  },
  gender:{
    type:String
  },
  lastExamType:{
    type:String,
  },
  qualification:{
    type:String,
  },
  assignedCollege:{
    type:String,
  },
  passingYear:{
    type:String
  },
  category:{
    type:String,
  },
entranceBasedTypeanceExam:{
    type:String,
  },
  nationality:{
    type:String
  },
  isApproved:{
    type:Boolean,
    default:false
  },
  isEnrolled:{
    type:Boolean,
    default:false
  },
  isRegistered:{
    type:Boolean,
    default:false
  },
  isPaid:{
    type:Boolean,
    default:false
  },
  enrollmentNumber:{
    type:String
  },
  
  Documents:DocumentSchema,
  currentSemester: {
    type: Number,
    default: 1,
  },
  admissionDate:{
    type:String,
  },

  semesterScheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SemesterScheme',
  },
    
},{timestamps:true});




    
    
    
// StudentSchema.pre('save', async function (next) {
//   console.log('Pre-save middleware executing...');
//   try {
//     if (this.isModified('IsEnrollGenerated') && this.IsEnrollGenerated) {
//       this.set('currentSemester', 1);
//       let semesterScheme = await SemesterScheme.findOne({ semesterNumber: this.currentSemester });
//       console.log(semesterScheme,"scheme")
//       if (semesterScheme) {
//         this.semesterScheme = semesterScheme._id;
//       }
//     }
//     next();
//   } catch (error) {
//     console.error('Error in pre-save middleware:', error);
//     next(error);
//   }
// });
    
    
    // if (!semesterScheme) {
    //   semesterScheme = await SemesterScheme.create({
    //     semesterNumber: this.currentSemester,
        
    //   });
    // }

    // this.semesterScheme = semesterScheme._id;
  



const Student = mongoose.model('Students',StudentSchema)

module.exports = Student;