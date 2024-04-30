const mongoose = require('mongoose');

//const SemesterScheme = require('./Semester');

// const AddressSchema = new mongoose.Schema({
 
//     address1: String,
//     address2: String,
//     country: String,
//     state: String,
//     district: String,
//     pinCode: String,
 
// });

// const ProfessionalDetailsSchema = new mongoose.Schema({
//   Handicapped: String,
//   Medium: String,

//   ScholarshipRequired: String,
//   FathersOccupation: String,
//   MothersOccupation: String,
//   FathersIncome: String,
//   MothersIncome: String,
//   SamagraId: String,
//   AadharNumber: String,
//   ParentMobile: String,
// });


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
  
});
const DocumentSchema = new mongoose.Schema({
  applicantPhoto:String,
  applicantSignature:String,
//   aadharCard:String,
//   marksheet10th:String,
//   marksheet12th:String,
//   undergraduateCertificate:String,
//   postgraduateCertificate:String,
//   domicileCertificate:String,
//   transferCertificate:String,
//   incomeCertificate:String,
//   migrationCertificate:String,
//   otherCertificate:String
});

const EntranceSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
     type:String,
     required:true
  },
  applicationNumber:{
    type:String,
  },
  address:{
    type:String,
  },
  academicDetails: AcademicDetailsSchema,
  dob:{
    type:Date,
    required:true
  } ,
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

  mobile:{
    type:String,

  },
  domicile:{
    type:String,

  },
  admissionSession:{
    type:String,
  },
  gender:{
    type:String
  },

  qualification:{
    type:String,
  },

  passingYear:{
    type:String
  },
  category:{
    type:String,
  },

  isSubmitted:{
    type:Boolean,
    default:false
  },
  isPaid:{
    type:Boolean,
    default:false
  },
  txnId:{
    type:String,
  },
  bankTxnId:{
    type:String,
  },
  paymentMode:{
    type:String,
  },
  txnDate:{
    type:String,
  },
  txnAmount:{
    type:String,
  },
  Documents:DocumentSchema,

},
{timestamps:true});



const EntranceDetails = mongoose.model('EntranceDetail',EntranceSchema)

module.exports = EntranceDetails;