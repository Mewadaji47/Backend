const mongoose = require('mongoose')
const Admin = require('../Modal/Admin')
const User = require('../Modal/Student')
const Enrollment = require('../Modal/Enrollment')
const jwt = require('jsonwebtoken')
const Course = require('../Modal/Course')
const NCourse = require('../Modal/NCourse')
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const SemesterScheme = require('../Modal/Semester.js')
const Payment = require('../Modal/PaymentD.js')
const Fees = require("../Modal/Fees.js");





// Admin API : UPDATING STUDENT DETAILS 
const  UpdateDetails    = async(req,res)=>{

    try {
        const {
          userID,
          formData,
          professionalData,
          academicData,
          addressData,
        } = req.body;
    
        console.log(professionalData, userID, formData, academicData, addressData, "hello this is data");
    
        const student = await User.findOneAndUpdate(
          { _id: userID },
          {
            $set: {
              academicDetails: academicData,
              address: addressData,
              professional: professionalData,
              name: formData.name,
              fathersname: formData.fathersname,
              mothersname: formData.mothersname,
              gender: formData.gender,
              nationality: formData.nationality,
              dob: formData.dob,
              domicile: formData.domicile,
              mobile: formData.mobile,
              category: formData.category,
              email: formData.email,
              qualification: formData.qualification,
              lastExamType: formData.lastExamType,
              admissionSession: formData.admissionSession,
              passingYear: formData.passingYear,
              QualifiedCourse: formData.QualifiedCourse,
              qualificationPercentage: formData.qualificationPercentage,
            },
          },
          { new: true }
        );
    
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
    
        res.json({ message: 'Student data updated successfully' });
    
      } catch (error) {
        console.error('Error updating student data:', error);
        res.status(500).json({ error: 'Internal server error' });
      }


}



// Admin API : Updating Student's Documents 
const UpdateDocuments = async(req,res)=>{
    try {
        const { userID, fileUrls } = req.body;
    
        console.log(fileUrls, userID, "hello this is data");
    
        const existingStudent = await User.findById(userID);
    
        if (!existingStudent) {
          return res.status(404).json({ error: 'Student not found' });
        }
    
        // Construct the update object dynamically
        const updateObject = {};
        Object.keys(fileUrls).forEach(key => {
          updateObject[`Documents.${key}`] = fileUrls[key];
        });
    
        Object.keys(existingStudent.Documents.toObject()).forEach(key => {
          if (!fileUrls[key]) {
            updateObject[`Documents.${key}`] = existingStudent.Documents[key];
          }
        });
    
        console.log('Update Object:', updateObject);
    
        const student = await User.findOneAndUpdate(
          { _id: userID },
          { $set: updateObject },
          { new: true }
        );
    
        if (!student) {
          return res.status(404).json({ error: 'Student not found' });
        }
    
        res.json({ message: 'Student data updated successfully', student });
    
      } catch (error) {
        console.error('Error updating student data:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}



























//Admin API : Generate Enrollment of Student By finding student through ID & according to course , CourseType , Branch 


//Function to find college from DB 
const findCollegeCodeByName = async (collegename) => {
    const college = await NCourse.findOne({"institute.name" : collegename  });
    return college ? college.institute.code : null;
  };
  

  //Function to find Course from DB 
  const findCourseCodeByName = async (coursename) => {
    const course = await NCourse.findOne({ name:coursename });
    return course ? course.code : null;
  };
  
  // Function to find branch code by name
  const findBranchCodeByName = async (branchname) => {
    const branch = await NCourse.findOne({ "branches.name": branchname });
    return branch ?  branch.branches[0].code : null;
  };
  



const CURRENT_YEAR = new Date().getFullYear() % 100;
const NewCurrentYear = CURRENT_YEAR-1


// API : To Generate Enrollment according to the Branch code , Course Code , College code and current Session 
const EnrollmentGenerate = async(req,res)=>{
    const { collegename, coursename, branchname , studentId} = req.body;
    //console.log(collegename , coursename , branchname , "kafirana sa hai ")
    const level  = 3
    const collegeCode =  await findCollegeCodeByName(collegename)
    const courseCode = await findCourseCodeByName(coursename)
    const branchCode = await findBranchCodeByName(branchname)
    console.log("data for code ", collegeCode , courseCode , branchCode)
    const currentYearLastTwoDigits = NewCurrentYear.toString().padStart(2, '0');
  
    try {
        const existingEnrollment = await User.findOne({ _id: studentId, IsEnrollGenerated:true});
        //console.log(existingEnrollment)
        if (existingEnrollment) {
          return res.status(400).json({ error: 'Enrollment already generated for this student' });
        }
      // Find or create enrollment document in the database
      const enrollment = await Enrollment.findOneAndUpdate(
        { collegeCode, courseCode, branchCode, level },
        {},
        { upsert: true, new: true }
      );
  
      // Increment and save the sequence number
      const sequenceNumber = enrollment.sequenceNumber;
      enrollment.sequenceNumber += 1;
      await enrollment.save();
  
      // Create and return the enrollment number
      const enrollmentNumber = `${currentYearLastTwoDigits}${collegeCode}${courseCode}${branchCode}${level}${sequenceNumber.toString().padStart(3, '0')}`;
      console.log(enrollmentNumber)
      const updatedStudent =  await User.findOneAndUpdate(
        { _id:studentId },
        { enrollmentNumber:enrollmentNumber, IsEnrollGenerated:true},
       
        { new: true }
      );
      //console.log(updatedStudent , "updated student ")
      const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  
  
  const Sender = process.env.SENDER_EMAIL
    const mailOptions = {
      from:`Sri Satya Sai University of Technology and Medical Science ${Sender}`,
      to: updatedStudent?.email,
      subject: 'Enrollment Confirmation',
      html: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
      <h2 style="color: #0077b6;"> <h2 style="color: #0077b6;">Hello ${updatedStudent?.name},</h2>\n\nCongratulations! You have been successfully enrolled in ${collegename} for the ${coursename} - ${branchname} .\n\nYour Enrollment Number is: <b>${enrollmentNumber}</b>\n\nPlease download the enrollment form and submit it to the HOD.\n\nThank you!\nUniversity Administration</div>`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send enrollment confirmation email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ enrollmentNumber });
      }
    });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}



//API : Manual Enrollment Generation 

const ManualEnrollment = async(req,res)=>{
  const { studentId, enrollmentNumber } = req.body;

  console.log("student id", studentId, enrollmentNumber);

  //  console.log(studentId1 , "student id21")
  // console.log(mongoose.Types.ObjectId(studentId))

  try {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid studentId format' });
    }
    const existingEnrollment = await User.findOne({ _id: studentId, IsEnrollGenerated: true });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Enrollment already generated for this student' });
    } else {
      const updatedStudent = await User.findByIdAndUpdate(
        studentId,
        { randomId: enrollmentNumber, IsEnrollGenerated: true, currentSemester: 1 },
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ error: 'Student not found' });
      }

      console.log(updatedStudent);
      res.json('Enrollment Generated Successfully');
    }

    // Rest of your code for sending emails...
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const CancelEnrollment = async(req,res)=>{
  const { collegename, coursename, branchname, studentId } = req.body;
  console.log(collegename, coursename, branchname, studentId, "data from frontend ")
  const level = 3
  const collegeCode = await findCollegeCodeByName(collegename)
  const courseCode = await findCourseCodeByName(coursename)
  const branchCode = await findBranchCodeByName(branchname)
  console.log("data for code ", collegeCode, courseCode, branchCode)
  const currentYearLastTwoDigits = NewCurrentYear.toString().padStart(2, '0');

  try {
    const existingEnrollment = await User.findOne({ _id: studentId, IsEnrollGenerated: true });
    //console.log(existingEnrollment)
    if (!existingEnrollment) {
      return res.status(400).json({ error: 'Enrollment is not generated for the student' });
    }
    // Find or create enrollment document in the database
    const enrollment = await Enrollment.findOneAndUpdate(
      { collegeCode, courseCode, branchCode, level },
      {},
      { upsert: true, new: true }
    );

    // Increment and save the sequence number
    const sequenceNumber = enrollment.sequenceNumber;
    enrollment.sequenceNumber -= 1;
    await enrollment.save();

    // Create and return the enrollment number
    const enrollmentNumber = `${currentYearLastTwoDigits}${collegeCode}${courseCode}${branchCode}${level}${sequenceNumber.toString().padStart(3, '0')}`;
    console.log(enrollmentNumber)
    const updatedStudent = await User.findOneAndUpdate(
      { _id: studentId },
      { enrollmentNumber: "", IsEnrollGenerated: false },

      { new: true }
    );
    console.log(updatedStudent, "updated student ")



    res.status(200).json(" Enrollment Cancelled Successfully ")



  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




//API : Create Course API FOr the scheme 

const CreateCourse = async(req,res)=>{
  try {
    const { name, code, branches, institute } = req.body;
    // console.log(name , code , "code ")
    // Check if the course with the given code already exists
    const existingCourse = await NCourse.findOne({ coursecode });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course with this code already exists' });
    }

    // Create a new course
    const newCourse = new NCourse({
      coursename,
      coursecode,
      branches,
      institute,
    });

    // Save the new course to the database
    await newCourse.save();

    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


//API : FEE SEARCH According for the current session According to current session 

const CurrentFee = async(req,res)=>{
  try {
    const { admissionSession, courseName, courseBranch } = req.query;


    const feeInfo = await Fees.findOne({
      admissionSession,
      courseName,
    });

    if (feeInfo) {

      const { enrollmentFee, registrationFee } = feeInfo;
      res.json({ enrollmentFee, registrationFee });
    } else {
      // If not found, send an error response
      res.status(404).json({ error: 'Fee information not found for the provided session and course.' });
    }
  } catch (error) {
    console.error('Error fetching fee information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}






//API :  

module.exports = {  UpdateDetails ,  UpdateDocuments , EnrollmentGenerate , ManualEnrollment , }