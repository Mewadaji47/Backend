// const express = require("express");
// const router = new express.Router();
// const Admin = require('../Modal/Admin')
// const User = require('../Modal/Student')
// const Enrollment = require('../Modal/Enrollment')
// const jwt = require('jsonwebtoken')
// const Course = require('../Modal/Course')

// //==========    ======================== Admin Login Page =============================   ============ //

// router.post('/api/admin/login', async (req, res) => {
//   const {email , password} = req.body
//   console.log(email , password , " data from postman ")
//     try {
//         const user = await Admin.findOne({ email: email })

//          const isPassword = await Admin.findOne({password : password})
//          console.log(isPassword , "is password ")
//         if (!user) {
//             res.status(401).json({ message: 'Invalid login credentials' });

//         } else {
//             const UserResponse = {
//                 user: user._id,
//                 email: user.email,

//             }
//             const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//             res.cookie("access-token", token, {
//                 httpOnly: true,
//                 sameSite: "None"
//             }).status(200).json({ message: "Hey Admin ! You have logged in successfully", UserResponse });
//         }
//     } catch (error) {
//         console.log(error)
//     }
// })



// //==========    ======================== Admin Registration Page =============================   ============ //
// router.post('/api/admin/register', (req, res) => {

//     const { email, Branch, Password, mobile, Gender, isHod } = req.body;

//     try {
//         const savedUser = new Admin({
//             email,

//             Password,
//             isAdmin: true

//         });

//         savedUser.save();

//         res.status(200).json('Registered Successfully')
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })





// //==========    ======================== Admin New Registration  Page API=============================   ============ //


// router.get('/api/admin/newregistrations', async (req, res) => {

//     try {

//         const students = await User.find();
//         const approvedStudents = students.filter(student => student.isApproved === false);
//         // console.log(approvedStudents)
//         res.status(200).json({ students: approvedStudents });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// })

// //==========    ======================== Admin Enrollment API  =============================   ============ //
// router.get('/api/admin/enrollment', async (req, res) => {

//     try {
//         const students = await User.find();
//         const approvedStudents = students.filter(student => student.isEnrolled === false && student.isApproved === true);

//         res.status(200).json({ students: approvedStudents });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }

// })













// router.get('/api/v2/newenrollmentrequest', async (req, res) => {
//   try {
//     const { courseType, courseName,   courseBranch, assignedCollege } = req.query;
//     console.log( courseType,
//       courseName,
//       courseBranch,
//       assignedCollege , "data from query ")
//     const students = await User.find({
//        courseType,
//        courseName,
//        courseBranch,
//        assignedCollege,
//         IsEnrollGenerated: true,
//        isPaid:true
//     });
//     console.log(students)
//     res.status(200).json(students);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });









// // router.get('/getcode',async(req,res)=>{
// //   const { collegename, coursename, branchname } = req.body;
// //   console.log(collegename, coursename , branchname , "data from postman")
// //  const colcode =  await findCollegeCodeByName(collegename)
// //  const cocode = await findCourseCodeByName(coursename)
// //   const bcode = await findBranchCodeByName(branchname)
// //   console.log(colcode , cocode ,bcode)
// //   res.json({colcode , cocode , bcode})
// // })


















// const CURRENT_YEAR = new Date().getFullYear() % 100;
// router.post('/generate-enrollment', async (req, res) => {
//     const { collegeCode, courseCode, branchCode, level  , studentId} = req.body;
//     const currentYearLastTwoDigits = CURRENT_YEAR.toString().padStart(2, '0');

//     try {
//         const existingEnrollment = await User.findOne({ _id: studentId, IsEnrollGenerated:true});
//         console.log(existingEnrollment)
//         if (existingEnrollment) {
//           return res.status(400).json({ error: 'Enrollment already generated for this student' });
//         }
//       // Find or create enrollment document in the database
//       const enrollment = await Enrollment.findOneAndUpdate(
//         { collegeCode, courseCode, branchCode, level },
//         {},
//         { upsert: true, new: true }
//       );

//       // Increment and save the sequence number
//       const sequenceNumber = enrollment.sequenceNumber;
//       enrollment.sequenceNumber += 1;
//       await enrollment.save();

//       // Create and return the enrollment number
//       const enrollmentNumber = `${currentYearLastTwoDigits}${collegeCode}${courseCode}${branchCode}${level}${sequenceNumber.toString().padStart(3, '0')}`;
//       console.log(enrollmentNumber)
//       const updatedStudent =  await User.findOneAndUpdate(
//         { _id:studentId },
//         {  randomId:enrollmentNumber},
//         {  IsEnrollGenerated:true},
//         { new: true }
//       );
//       console.log(updatedStudent , "updated student ")
//       res.json({ enrollmentNumber });

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });



//   const findCollegeCodeByName = async (collegename) => {
//     const college = await Course.findOne({"institute.name" : collegename  });
//     return college ? college.institute.code : null;
//   };


//   const findCourseCodeByName = async (coursename) => {
//     const course = await Course.findOne({ name:coursename });
//     return course ? course.institute.code : null;
//   };

//   // Function to find branch code by name
//   const findBranchCodeByName = async (branchname) => {
//     const branch = await Course.findOne({ "branches.name": branchname });
//     return branch ?  branch.branches[0].code : null;
//   };



// router.post('/generate-enrollment2', async (req, res) => {
//     const { collegename, coursename, branchname , studentId} = req.body;
//     console.log(collegename , coursename , branchname , "kafirana sa hai ")
//     const level  = 3
//     const collegeCode =  await findCollegeCodeByName(collegename)
//     const courseCode = await findCourseCodeByName(coursename)
//     const branchCode = await findBranchCodeByName(branchname)
//     console.log("data for code ", collegeCode , courseCode , branchCode)
//     const currentYearLastTwoDigits = CURRENT_YEAR.toString().padStart(2, '0');

//     try {
//         const existingEnrollment = await User.findOne({ _id: studentId, IsEnrollGenerated:true});
//         //console.log(existingEnrollment)
//         if (existingEnrollment) {
//           return res.status(400).json({ error: 'Enrollment already generated for this student' });
//         }
//       // Find or create enrollment document in the database
//       const enrollment = await Enrollment.findOneAndUpdate(
//         { collegeCode, courseCode, branchCode, level },
//         {},
//         { upsert: true, new: true }
//       );

//       // Increment and save the sequence number
//       const sequenceNumber = enrollment.sequenceNumber;
//       enrollment.sequenceNumber += 1;
//       await enrollment.save();

//       // Create and return the enrollment number
//       const enrollmentNumber = `${currentYearLastTwoDigits}${collegeCode}${courseCode}${branchCode}${level}${sequenceNumber.toString().padStart(3, '0')}`;
//       console.log(enrollmentNumber)
//       const updatedStudent =  await User.findOneAndUpdate(
//         { _id:studentId },
//         {  randomId:enrollmentNumber, IsEnrollGenerated:true},

//         { new: true }
//       );
//       //console.log(updatedStudent , "updated student ")
//       res.json({ enrollmentNumber });

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });














//  


//   // router.get('/getcodes', async (req, res) => {
//   //   try {
//   //     const { name } = req.body;
//   //    console.log(name ,"course name ")
//   //     // Check if the course with the given name already exists
//   //     const foundCourse = await Course.findOne({ name });

//   //     if (!foundCourse) {
//   //       return res.status(404).json({ error: 'Course not found' });
//   //     }

//   //     res.status(200).json({ foundCourse });
//   //   } catch (error) {
//   //     console.error(error);
//   //     res.status(500).json({ error: 'Internal Server Error' });
//   //   }
//   // });

// module.exports = router

const express = require("express");
const router = new express.Router();
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

//==========    ======================== Admin Login Page =============================   ============ //

router.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body
  //console.log(email , password , " data from postman ")
  try {
    const user = await Admin.findOne({ email: email, password: password })

    //const isPassword = await Admin.findOne({ password: password })
    // console.log(user , "is password ")
    if (!user) {
      res.status(401).json({ message: 'Invalid login credentials' });

    } else {
      const UserResponse = {
        user: user._id,
        email: user.email,
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "None"
      }).status(200).json({ message: "Hey Admin ! You have logged in successfully", UserResponse });
    }
  } catch (error) {
    console.log(error)
  }
})


// router.get('/api/admin/zero', async (req,res)=>{
//     res.json("chal raha ye to ")
// })

//==========    ======================== Admin Registration Page =============================   ============ //
router.post('/api/admin/register', (req, res) => {

  const { email, Branch, Password, mobile, Gender, isHod } = req.body;

  try {
    const savedUser = new Admin({
      email,

      Password,
      isAdmin: true

    });

    savedUser.save();

    res.status(200).json('Registered Successfully')
  } catch (err) {
    res.status(500).json(err)
  }
})





//==========    ======================== Admin New Registration  Page API=============================   ============ //


// router.get('/api/admin/newregistrations', async (req, res) => {

//   try {

//     const students = await User.find();
//     const approvedStudents = students.filter(student => student.isApproved === false);
//     // console.log(approvedStudents)
//     res.status(200).json({ students: approvedStudents });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// })

//+============================================= Admin API   New Registration ===============================================//




router.get('/api/admin/newregistered', async (req, res) => {

  try {
    const students = await User.find({
      isRegistered: true,
      isPaid: false,
      isApproved: false,
      isEnrolled: false
    });

    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});










//+============================================= Admin API   New Registration ============================
router.get('/api/admin/searchapi ', async (req, res) => {
  const query = req.query.query;

  try {
    const results = await User.find({
      $or: [
        { randomId: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },

      ],
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})





//==========    ======================== Admin Enrollment API  =============================   ============ //
router.get('/api/admin/enrollment', async (req, res) => {

  try {
    const students = await User.find();
    const approvedStudents = students.filter(student => student.isEnrolled === false && student.isApproved === true);

    res.status(200).json({ students: approvedStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})








//Enrollment request student's data 

router.post('/apitest/v2/newenrollmentrequest', async (req, res) => {
  try {
    const { session, courseType, course, branch, college } = req.body;
    console.log(courseType,
      course,
      branch,
      college, session, "data from query ")

    const students = await User.find({
      admissionSession: session,
      //  courseType,
      courseName: course,
      courseBranch: branch,
      // assignedCollege:college,
      IsEnrollGenerated: false,
      isPaid: true
    });
    console.log(students)
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/v2/newenrollmentrequest2', async (req, res) => {
  try {
    const { admissionSession, courseType, courseName, courseBranch, assignedCollege } = req.query;
    console.log(courseType,
      courseName,
      courseBranch,
      assignedCollege, admissionSession, "data from body")

    const students = await User.find({
      // admissionSession,
      // courseType,
      courseName,
      courseBranch,
      // assignedCollege,
      // IsEnrollGenerated:false,
      isPaid: true
    });
    console.log(students)
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/api/v2/listofenrolledstudent', async (req, res) => {
  try {
    const { session, courseType, course, branch, college } = req.query;
    console.log(courseType,
      course,
      branch,
      college, "data from query ")
    const students = await User.find({
      admissionSession: session,
      courseType,
      courseName: course,
      courseBranch: branch,
      assignedCollege: college,
      IsEnrollGenerated: true,
      isPaid: true
    });
    console.log(students)
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/apitest/students/today/count', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(today)
  try {
    const count = await User.countDocuments({
      createdAt: { $gte: today },

    });
    const Totalcount = await User.countDocuments({
    });
    const paidStudentCount = await User.countDocuments({
      isPaid: true,
    });
    const TotalEnrolled = await User.countDocuments({
      isEnrolled: true
    });
    res.json({ count, Totalcount, paidStudentCount, TotalEnrolled });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/apitest/admin/students/paidlist', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(today)
  try {
    const students = await User.find({
      isPaid: true,

    });
    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/apitest/admin/students/totallist', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(today)
  try {
    const students = await User.find({


    });
    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});










///Enrollment Generation Code 

const findCollegeCodeByName = async (collegename) => {
  const college = await NCourse.findOne({ "institute.name": collegename });
  return college ? college.institute.code : null;
};


const findCourseCodeByName = async (coursename) => {
  const course = await NCourse.findOne({ name: coursename });
  return course ? course.code : null;
};

// Function to find branch code by name
const findBranchCodeByName = async (branchname) => {
  const branch = await NCourse.findOne({ "branches.name": branchname });
  return branch ? branch.branches[0].code : null;
};


const CURRENT_YEAR = new Date().getFullYear() % 100;
const NewCurrentYear = CURRENT_YEAR - 1
//onsole.log(NewCurrentYear)
// router.post('/api/generate-enrollment2', async (req, res) => {
//   const { collegename, coursename, branchname, studentId } = req.body;
//   console.log(collegename, coursename, branchname, "Message from Kali ............")
//   const level = 3
//   const collegeCode = await findCollegeCodeByName(collegename)
//   const courseCode = await findCourseCodeByName(coursename)
//   const branchCode = await findBranchCodeByName(branchname)
//   console.log("data for code ", collegeCode, courseCode, branchCode)
//   const currentYearLastTwoDigits = NewCurrentYear.toString().padStart(2, '0');

//   try {
//     const existingEnrollment = await User.findOne({ _id: studentId, IsEnrollGenerated: true });
//     //console.log(existingEnrollment)
//     if (existingEnrollment) {
//       return res.status(400).json({ error: 'Enrollment already generated for this student' });
//     }
//     // Find or create enrollment document in the database
//     const enrollment = await Enrollment.findOneAndUpdate(
//       { collegeCode, courseCode, branchCode, level },
//       {},
//       { upsert: true, new: true }
//     );

//     // Increment and save the sequence number
//     const sequenceNumber = enrollment.sequenceNumber;
//     enrollment.sequenceNumber += 1;
//     await enrollment.save();

//     // Create and return the enrollment number
//     const enrollmentNumber = `${currentYearLastTwoDigits}${collegeCode}${courseCode}${branchCode}${level}${sequenceNumber.toString().padStart(3, '0')}`;
//     console.log(enrollmentNumber)
//     const updatedStudent = await User.findOneAndUpdate(
//       { _id: studentId },
//       { enrollmentNumber: enrollmentNumber, IsEnrollGenerated: true , currentSemester:1 },

//       { new: true }
//     );


//     const semesterScheme = await SemesterScheme.findOne({ semesterNumber:1});
//     console.log(semesterScheme, "semester")
//     // If the scheme is found, assign it to the user
//     if (semesterScheme) {
//       updatedStudent.semesterScheme = semesterScheme._id;
//       await updatedStudent.save();
//       console.log(updatedStudent ,  " student updated")
//     }



//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: updatedStudent.email,
//       subject: 'Enrollment Confirmation',
//       text: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
//       <h2 style="color: #0077b6;"> <h2 style="color: #0077b6;">Hello ${updatedStudent.name},</h2>,\n\nCongratulations! You have been successfully enrolled in ${collegename} for the ${coursename} - ${branchname} .\n\nYour Enrollment Number is: <b>${enrollmentNumber}</b>\n\nPlease download the enrollment form and submit it to the HOD.\n\nThank you!\nUniversity Administration</div>`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to send enrollment confirmation email' });
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.json({ enrollmentNumber });
//       }
//     });


//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




router.post('/apitest/generate-enrollment2', async (req, res) => {
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
    const updatedStudent = await User.findOneAndUpdate(
      { _id: studentId },
      { enrollmentNumber: enrollmentNumber, IsEnrollGenerated: true },

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
      from: `Sri Satya Sai University of Technology and Medical Science ${Sender}`,
      to: updatedStudent.email,
      subject: 'Enrollment Confirmation',
      html: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
    <h2 style="color: #0077b6;"> <h2 style="color: #0077b6;">Hello ${updatedStudent.name},</h2>\n\nCongratulations! You have been successfully enrolled in ${collegename} for the ${coursename} - ${branchname} .\n\nYour Enrollment Number is: <b>${enrollmentNumber}</b>\n\nPlease download the enrollment form and submit it to the HOD.\n\nThank you!\nUniversity Administration</div>`,
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
});

router.put("/api/manualenrollment-generate", async (req, res) => {
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
});

//Cancel Enrollment code


router.post('/apitest/cancel-enrollment2', async (req, res) => {
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
});




router.post('/apitest/admin/pendingstudentlist', async (req, res) => {
  const { assignedCollege, courseType, courseName, courseBranch, admissionSession } = req.body;

  console.log(assignedCollege, courseType, courseName, courseBranch, admissionSession, "data ")
  try {

    if (!assignedCollege && !admissionSession && !courseType && !courseName && !courseBranch) {
      return res.status(400).json({ message: "Cannot proceed with empty field . Please select options to search" })
    }
    if (typeof courseName === 'undefined' && typeof courseType === 'undefined' && typeof courseBranch === 'undefined' && typeof admissionSession === 'undefined' && typeof assignedCollege === 'undefined') {
      return res.status(400).json({ message: "courseName is required for the search" });
    }


    const students = await User.find({
      courseBranch,
      admissionSession,
      courseName,
      courseType,
      isRegistered: true,
      isApproved: false
    });

    res.status(200).json({ students })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }

})



router.get('/api/admin/approvedstudentlist', async (req, res) => {
  const { assignedCollege, courseType, courseName, courseBranch, admissionSession } = req.body;
  console.log(assignedCollege, courseName, courseBranch, admissionSession, "data ")
  try {

    if (!assignedCollege && !admissionSession && !courseType && !courseName && !courseBranch) {
      return res.status(400).json({ message: "Cannot proceed with empty field . Please select options to search" })
    }

    const students = await User.find({
      courseBranch,
      admissionSession,
      courseName,
      courseType,
      isRegistered: true,
      isApproved: true
    });

    res.status(200).json({ students })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }

})


router.post('/api/create-course', async (req, res) => {
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
});

//Masters 


//============== Admin Student Api ==============  ///
router.put('/api/admin/updatestudent', async (req, res) => {
  try {
    const {
      // fileUrls,
      professionalFormData,
      addressFormData,
      educationFormData,
      studentId
    } = req.body;

    // Check for missing data
    // if (!professionalFormData) {
    //    return res.status(400).json({ error: 'All fields are required' });
    // }

    // Validate data types
    //   const errors = [];



    console.log(professionalFormData, studentId);
    const student = await User.findOneAndUpdate(

      { _id: studentId },
      {
        $set: {
          academicDetails: educationFormData,
          address: addressFormData,
          professional: professionalFormData,

        },
      },
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
});

// Documents update code 

router.post('/api/v2/admin/updatestudentdocuments', async (req, res) => {
  try {
    const {
      fileUrls,

    } = req.body;
    const { UserId } = req.query

    console.log(UserId, "djfdkfjd")
    const student = await User.findByIdAndUpdate(
      UserId,
      {
        $set: {
          Documents: fileUrls,
        },
      },
      { new: true }
    );
    // console.log(student, "student detail ")
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student data updated successfully' });

  } catch (error) {
    console.error('Error updating student data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/api/v2/admin/updatedocuments2', async (req, res) => {
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
});


router.get('/apitest/students/today/list', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(today)
  const { branch } = req.query;
  try {
    const students = await User.find({
      createdAt: { $gte: today },
    });
    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/api/admin/masters/assignSubject', async (req, res) => {


  try {
    const studentId = req.body.id
    const populatedStudent = await User.findOne({ _id: studentId }).populate('semesterScheme').lean();

    res.json({ populatedStudent });
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error');
  }


})










router.post('/apitest/admin/addCurrentSessionFee2', async (req, res) => {
  try {
    const { admissionSession, courseName, courseBranch, enrollmentFee, registrationFee } = req.body;
    console.log(admissionSession, courseName, courseBranch, enrollmentFee, registrationFee, "cureent fees")

    const payment = new Fees({
      admissionSession,
      courseName,
      courseBranch,
      enrollmentFee,
      registrationFee

    });
    await payment.save();

    res.status(201).json({ message: 'Payment data created successfully', payment });
  } catch (error) {
    console.error('Error creating payment data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.post('/insertBulkData', async (req, res) => {
  try {
    const dataToInsert = req.body;

    // Use Mongoose model to insert data in bulk
    const data = await Fees.insertMany(dataToInsert);

    res.status(200).json({ message: 'Bulk data inserted successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







router.get('/apitest/admin/fee/search', async (req, res) => {
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
});





//create scheme for semester 1

router.post('/createScheme', async (req, res) => {
  try {
    const { semesterNumber, courseType, courseName, courseBranch, subjects } = req.body;

    // Create a new SemesterScheme document
    const newScheme = new SemesterScheme({
      semesterNumber,
      courseType,
      courseName,
      courseBranch,
      subjects,
    });

    // Save the document to the database
    const savedScheme = await newScheme.save();

    res.status(201).json(savedScheme);
  } catch (error) {
    console.error('Error creating semester scheme:', error);
    res.status(500).send('Internal Server Error');
  }
});





router.get('/apitest/admin/status', async (req, res) => {
  const { assignedCollege, courseType, courseName, courseBranch, admissionSession } = req.query;
  console.log(assignedCollege, courseName, courseBranch, admissionSession, "data ")
  try {

    if (!admissionSession && !courseType && !courseName && !courseBranch) {
      return res.status(400).json({ message: "Cannot proceed with empty field . Please select options to search" })
    }

    const students = await User.find({
      courseBranch,
      admissionSession,
      courseName,
      courseType,
    });

    res.status(200).json({ students })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }

})



router.get('/apitest/admin/searchonlinepayments', async (req, res) => {
  const { search } = req.query;

  try {
    // Construct a query object based on the general search string
    const query = {
      $or: [
        { randomId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: new RegExp(search.trim(), 'i') } },
        { mobile: { $regex: search, $options: 'i' } },
      ],
    };

    // Use the find method to search the database
    const result = await Payment.find(query);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






router.get('/payments/populate-student', async (req, res) => {
  try {

    await User;

    const payments = await Payment.find().populate('student');
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/payments/populate-student', async (req, res) => {
  const { courseBranch } = req.body
  try {

    const payments = await Payment.find({ courseBranch })
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/apitest/admin/admissionSlip', async (req, res) => {
  try {
      const {  newAdmissionDate, studentIds } = req.body;
      console.log(studentIds ,"student ki id ")
      console.log(newAdmissionDate , "student 's data ")

      
      const studentsToUpdate = await User.find({  _id: { $in: studentIds }  });
       console.log(studentsToUpdate , "data")
      if (studentsToUpdate.length === 0) {
          return res.status(404).json({ message: 'No students found with the provided IDs and adminId.' });
      }
       
      
      await Promise.all(studentsToUpdate.map(async (student) => {
          student.admissionDate = newAdmissionDate;
          await student.save();
      }));

      res.status(200).json({ message: 'Admission session updated successfully.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router