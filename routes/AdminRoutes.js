const express = require("express");
const router = new express.Router();
const Admin = require("../Modal/Admin");
const User = require("../Modal/Student");
const Enrollment = require("../Modal/Enrollment");
const jwt = require("jsonwebtoken");
const Course = require("../Modal/Course");
const NCourse = require("../Modal/NCourse");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const SemesterScheme = require("../Modal/Semester.js");
const Payment = require("../Modal/PaymentD.js");
const Fees = require("../Modal/Fees.js");
const VerifyAdmin = require("../middleware/VerifyAdmin.js");
const Course2 = require("../Modal/SessionCourse.js");
const Entrance = require("../Modal/EntranceDetails.js");
const Fees2 = require("../Modal/Fees2.js");
const Fees3 = require("../Modal/Fees3.js");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const cache = new NodeCache();




const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: "Too many requests from this IP, please try again later"
});




//==========    ======================== Admin Login Page =============================   ============ //

router.post("/apitest/admin/login", limiter , async (req, res) => {
  const { email, password } = req.body;
  //console.log(email , password , " data from postman ")
  try {
    const user = await Admin.findOne({ email: email, password: password });

    //const isPassword = await Admin.findOne({ password: password })
    // console.log(user , "is password ")
    if (!user) {
      res.status(401).json({ message: "Invalid login credentials" });
    } else {
      const UserResponse = {
        user: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
       
      );

      const option = {
        expires: new Date(Date.now() + 3600000),
        httpOnly: false,
        secure: true,
        sameSite: "None",
        //   domain:'sssutms.ac.in'
      };
      res.cookie("accessToken", token, option).status(200).json({
        message: "Hey Admin ! You have logged in successfully",
        UserResponse,
        token
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// router.get('/api/admin/zero', async (req,res)=>{
//     res.json("chal raha ye to ")
// })

//==========    ======================== Admin Registration Page =============================   ============ //
router.post("/api/admin/register", (req, res) => {
  const { email, Branch, Password, mobile, Gender, isHod } = req.body;

  try {
    const savedUser = new Admin({
      email,

      Password,
      isAdmin: true,
    });

    savedUser.save();

    res.status(200).json("Registered Successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

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

router.get("/api/admin/newregistered" , async (req, res) => {
  // Generate a unique cache key
  const cacheKey = "new_registered_students";

  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
   // console.log("Data retrieved from cache");
    return res.status(200).json(cachedData);
  }

  try {
    // Fetch data from the database
    const students = await User.find({
      isRegistered: true,
      isPaid: false,
      isApproved: false,
      isEnrolled: false,
    });

    // Store data in cache with a TTL of 60 seconds (adjust as needed)
    cache.set(cacheKey, students, 600);

    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




//+============================================= Admin API   New Registration ============================

router.get("/api/admin/searchapi", async (req, res) => {
  const query = req.query.query;

  // Generate a unique cache key based on the search query
  const cacheKey = `search_results_${query}`;

  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    //console.log("Data retrieved from cache");
    return res.status(200).json(cachedData);
  }

  try {
    // Fetch data from the database
    const results = await User.find({
      $or: [
        { randomId: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    // Store data in cache with a TTL of 60 seconds (adjust as needed)
    cache.set(cacheKey, results, 6000);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});




//==========    ======================== Admin Enrollment API  =============================   ============ //
router.get("/api/admin/enrollment", async (req, res) => {
  try {
    const students = await User.find();
    const approvedStudents = students.filter(
      (student) => student.isEnrolled === false && student.isApproved === true
    );

    res.status(200).json({ students: approvedStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Enrollment request student's data

router.post("/apitest/v2/newenrollmentrequest",  VerifyAdmin , async (req, res) => {
  try {
    const { session, courseType, course, branch, college } = req.body;
    console.log(
      courseType,
      course,
      branch,
      college,
      session,
      "data from query "
    );

    const students = await User.find({
      admissionSession: session,
      //  courseType,
      courseName: course,
      courseBranch: branch,
      // assignedCollege:college,
      IsEnrollGenerated: false,
      isPaid: true,
    });
    console.log(students);
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});














// router.get("/api/v2/newenrollmentrequest2",  VerifyAdmin ,async (req, res) => {
//   try {
//     const {
//       admissionSession,
//       courseType,
//       courseName,
//       courseBranch,
//       assignedCollege,
//     } = req.query;
//     console.log(
//       courseType,
//       courseName,
//       courseBranch,
//       assignedCollege,
//       admissionSession,
//       "data from body"
//     );

//     const students = await User.find({
//       // admissionSession,
//       // courseType,
//       courseName,
//       courseBranch,
//       // assignedCollege,
//       // IsEnrollGenerated:false,
//       isPaid: true,
//     });
//     console.log(students);
//     res.status(200).json(students);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });





// Cache-Storage

router.get("/api/v2/newenrollmentrequest2",  async (req, res) => {
  try {
    const {
      admissionSession,
      courseType,
      courseName,
      courseBranch,
      assignedCollege,
    } = req.query;

   
    const cacheKey = `${admissionSession}_${courseType}_${courseName}_${courseBranch}_${assignedCollege}`;

   
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Data retrieved from cache");
      return res.status(200).json(cachedData);
    }

    
    const students = await User.find({
      courseName,
      courseBranch,
      isPaid: true,
    });

   
    cache.set(cacheKey, students, 60);

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


//Cache_Storage 

router.get("/api/v2/listofenrolledstudent", VerifyAdmin, async (req, res) => {
  try {
    const { session, courseType, course, branch, college } = req.query;

    // Generate a unique cache key based on the request parameters
    const cacheKey = `enrolled_students_${session}_${courseType}_${course}_${branch}_${college}`;

    // Check if data exists in cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Data retrieved from cache");
      return res.status(200).json(cachedData);
    }

    // Fetch data from the database
    const students = await User.find({
      admissionSession: session,
      courseType,
      courseName: course,
      courseBranch: branch,
      assignedCollege: college,
      IsEnrollGenerated: true,
      isPaid: true,
    });

    // Store data in cache with a TTL of 60 seconds (adjust as needed)
    cache.set(cacheKey, students, 60);

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/apitest/students/today/count",  VerifyAdmin, async (req, res) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   console.log(today);
//   try {
//     const count = await User.countDocuments({
//       createdAt: { $gte: today },
//     });
//     const Totalcount = await User.countDocuments({});
//     const paidStudentCount = await User.countDocuments({
//       isPaid: true,
//     });
//     const TotalEnrolled = await User.countDocuments({
//       isEnrolled: true,
//     });
//     res.json({ count, Totalcount, paidStudentCount, TotalEnrolled });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });



router.get("/apitest/students/today/count", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  //console.log(today);

  // Generate a unique cache key for today's student count
  const cacheKey = `today_student_count_${today.getTime()}`;

  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    //console.log("Data retrieved from cache");
    return res.status(200).json(cachedData);
  }

  try {
    // Fetch data from the database
    const count = await User.countDocuments({ createdAt: { $gte: today } });
    const Totalcount = await User.countDocuments({});
    const paidStudentCount = await User.countDocuments({ isPaid: true });
    const TotalEnrolled = await User.countDocuments({ isEnrolled: true });

    // Store data in cache with a TTL of 60 seconds (adjust as needed)
    const responseData = { count, Totalcount, paidStudentCount, TotalEnrolled };
    cache.set(cacheKey, responseData, 600);

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});












router.get("/apitest/admin/students/paidlist", async (req, res) => {
  // Generate a unique cache key
  const cacheKey = "paid_students";

  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Data retrieved from cache");
    return res.status(200).json(cachedData);
  }

  try {
    // Fetch data from the database
    const students = await User.find({ isPaid: true });

    // Store data in cache with a TTL of 60 seconds (adjust as needed)
    cache.set(cacheKey, students, 60);

    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});










//Cached 

router.get("/apitest/admin/students/totallist", async (req, res) => {
  // Generate a unique cache key
  const cacheKey = "total_students";

  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Data retrieved from cache");
    return res.status(200).json(cachedData);
  }

  try {
    // Fetch data from the database
    const students = await User.find({});

    // Store data in cache with a TTL of 60 seconds (adjust as needed)
    cache.set(cacheKey, students, 60);

    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
const NewCurrentYear = CURRENT_YEAR - 1;
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

router.post("/apitest/generate-enrollment2",  VerifyAdmin , async (req, res) => {
  const { collegename, coursename, branchname, studentId } = req.body;
  console.log(
    collegename,
    coursename,
    branchname,
    studentId,
    "data from frontend "
  );
  const level = 3;
  const collegeCode = await findCollegeCodeByName(collegename);
  const courseCode = await findCourseCodeByName(coursename);
  const branchCode = await findBranchCodeByName(branchname);
  console.log("data for code ", collegeCode, courseCode, branchCode);
  const currentYearLastTwoDigits = NewCurrentYear.toString().padStart(2, "0");

  try {
    const existingEnrollment = await User.findOne({
      _id: studentId,
      IsEnrollGenerated: true,
    });
    //console.log(existingEnrollment)
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ error: "Enrollment already generated for this student" });
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
    const enrollmentNumber = `${currentYearLastTwoDigits}${collegeCode}${courseCode}${branchCode}${level}${sequenceNumber
      .toString()
      .padStart(3, "0")}`;
    console.log(enrollmentNumber);
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

    const Sender = process.env.SENDER_EMAIL;
    const mailOptions = {
      from: `Sri Satya Sai University of Technology and Medical Science ${Sender}`,
      to: updatedStudent.email,
      subject: "Enrollment Confirmation",
      html: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
    <h2 style="color: #0077b6;"> <h2 style="color: #0077b6;">Hello ${updatedStudent.name},</h2>\n\nCongratulations! You have been successfully enrolled in ${collegename} for the ${coursename} - ${branchname} .\n\nYour Enrollment Number is: <b>${enrollmentNumber}</b>\n\nPlease download the enrollment form and submit it to the HOD.\n\nThank you!\nUniversity Administration</div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Failed to send enrollment confirmation email" });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ enrollmentNumber });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/api/manualenrollment-generate", VerifyAdmin, async (req, res) => {
  const { studentId, enrollmentNumber } = req.body;

  console.log("student id", studentId, enrollmentNumber);

  //  console.log(studentId1 , "student id21")
  // console.log(mongoose.Types.ObjectId(studentId))

  try {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid studentId format" });
    }
    const existingEnrollment = await User.findOne({
      _id: studentId,
      IsEnrollGenerated: true,
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ error: "Enrollment already generated for this student" });
    } else {
      const updatedStudent = await User.findByIdAndUpdate(
        studentId,
        {
          randomId: enrollmentNumber,
          IsEnrollGenerated: true,
          currentSemester: 1,
        },
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }

      console.log(updatedStudent);
      res.json("Enrollment Generated Successfully");
    }

    // Rest of your code for sending emails...
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Cancel Enrollment code

router.post("/apitest/cancel-enrollment2", VerifyAdmin, async (req, res) => {
  const { collegename, coursename, branchname, studentId } = req.body;
  console.log(
    collegename,
    coursename,
    branchname,
    studentId,
    "data from frontend "
  );
  const level = 3;
  const collegeCode = await findCollegeCodeByName(collegename);
  const courseCode = await findCourseCodeByName(coursename);
  const branchCode = await findBranchCodeByName(branchname);
  console.log("data for code ", collegeCode, courseCode, branchCode);
  const currentYearLastTwoDigits = NewCurrentYear.toString().padStart(2, "0");

  try {
    const existingEnrollment = await User.findOne({
      _id: studentId,
      IsEnrollGenerated: true,
    });
    //console.log(existingEnrollment)
    if (!existingEnrollment) {
      return res
        .status(400)
        .json({ error: "Enrollment is not generated for the student" });
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
    const enrollmentNumber = `${currentYearLastTwoDigits}${collegeCode}${courseCode}${branchCode}${level}${sequenceNumber
      .toString()
      .padStart(3, "0")}`;
    console.log(enrollmentNumber);
    const updatedStudent = await User.findOneAndUpdate(
      { _id: studentId },
      { enrollmentNumber: "", IsEnrollGenerated: false },

      { new: true }
    );
    console.log(updatedStudent, "updated student ");

    res.status(200).json(" Enrollment Cancelled Successfully ");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/apitest/admin/pendingstudentlist", VerifyAdmin , async (req, res) => {
  const {
    assignedCollege,
    courseType,
    courseName,
    courseBranch,
    admissionSession,
  } = req.body;

  console.log(
    assignedCollege,
    courseType,
    courseName,
    courseBranch,
    admissionSession,
    "data "
  );
  try {
    if (
      !assignedCollege &&
      !admissionSession &&
      !courseType &&
      !courseName &&
      !courseBranch
    ) {
      return res.status(400).json({
        message:
          "Cannot proceed with empty field . Please select options to search",
      });
    }
    if (
      typeof courseName === "undefined" &&
      typeof courseType === "undefined" &&
      typeof courseBranch === "undefined" &&
      typeof admissionSession === "undefined" &&
      typeof assignedCollege === "undefined"
    ) {
      return res
        .status(400)
        .json({ message: "courseName is required for the search" });
    }

    const students = await User.find({
      courseBranch,
      admissionSession,
      courseName,
      courseType,
      isRegistered: true,
      isApproved: false,
    });

    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/admin/approvedstudentlist",  VerifyAdmin, async (req, res) => {
  const {
    assignedCollege,
    courseType,
    courseName,
    courseBranch,
    admissionSession,
  } = req.body;
  console.log(
    assignedCollege,
    courseName,
    courseBranch,
    admissionSession,
    "data "
  );
  try {
    if (
      !assignedCollege &&
      !admissionSession &&
      !courseType &&
      !courseName &&
      !courseBranch
    ) {
      return res.status(400).json({
        message:
          "Cannot proceed with empty field . Please select options to search",
      });
    }

    const students = await User.find({
      courseBranch,
      admissionSession,
      courseName,
      courseType,
      isRegistered: true,
      isApproved: true,
    });

    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/api/create-course", VerifyAdmin, async (req, res) => {
  try {
    const { name, code, branches, institute } = req.body;
    // console.log(name , code , "code ")
    // Check if the course with the given code already exists
    const existingCourse = await NCourse.findOne({ coursecode });
    if (existingCourse) {
      return res
        .status(400)
        .json({ error: "Course with this code already exists" });
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

    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Masters

//============== Admin Student Api ==============  ///
router.put("/api/admin/updatestudent", async (req, res) => {
  try {
    const {
      // fileUrls,
      professionalFormData,
      addressFormData,
      educationFormData,
      studentId,
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
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student data updated successfully", student });
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Documents update code

router.post("/api/v2/admin/updatestudentdocuments", async (req, res) => {
  try {
    const { fileUrls } = req.body;
    const { UserId } = req.query;

    console.log(UserId, "djfdkfjd");
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
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student data updated successfully" });
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/api/v2/admin/updatedocuments2", async (req, res) => {
  try {
    const { userID, fileUrls } = req.body;

    console.log(fileUrls, userID, "hello this is data");

    const existingStudent = await User.findById(userID);

    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Construct the update object dynamically
    const updateObject = {};
    Object.keys(fileUrls).forEach((key) => {
      updateObject[`Documents.${key}`] = fileUrls[key];
    });

    Object.keys(existingStudent.Documents.toObject()).forEach((key) => {
      if (!fileUrls[key]) {
        updateObject[`Documents.${key}`] = existingStudent.Documents[key];
      }
    });

    console.log("Update Object:", updateObject);

    const student = await User.findOneAndUpdate(
      { _id: userID },
      { $set: updateObject },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student data updated successfully", student });
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/apitest/students/today/list", VerifyAdmin, async(req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(today);
  const { branch } = req.query;
  try {
    const students = await User.find({
      createdAt: { $gte: today },
    });
    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/admin/masters/assignSubject", VerifyAdmin ,  async (req, res) => {
  try {
    const studentId = req.body.id;
    const populatedStudent = await User.findOne({ _id: studentId })
      .populate("semesterScheme")
      .lean();

    res.json({ populatedStudent });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/apitest/admin/EntranceFee2", async (req, res) => {
  try {
    const newFees = new Fees2({
      sessions: [
        {
          sessionYear: "2024",
          courseNames: [
            {
              courseName: "BACHELOR OF ENGINEERING",
              registrationFee: 100,
            },
            {
              courseName: "BACHELOR OF DESIGN",
              registrationFee: 100,
            },
            {
              courseName: "BACHELOR OF PHARMACY",
              registrationFee: 100,
            },
            {
              courseName: "BACHELOR OF EDUCATION",
              registrationFee: 100,
            },
            {
              courseName: "BACHELOR OF HOTEL MANAGEMENT AND CATERING",
              registrationFee: 100,
            },
            {
              courseName: "BSC(Nursing) SEMESTER",
              registrationFee: 100,
            },
            {
              courseName: "BACHELOR OF PHYSICAL EDUCATION(B. P. Ed.)",
              registrationFee: 100,
            },
            {
              courseName:
                "BACHELOR OF ARTS BACHELOR OF EDUCATION (B. A. B. Ed.)",
              registrationFee: 100,
            },
            {
              courseName: "MASTER OF TECHNOLOGY",
              registrationFee: 100,
            },
            {
              courseName: "MASTER OF PHARMACY",
              registrationFee: 100,
            },
            {
              courseName: "MASTER OF BUSINESS ADMINISTRATION(MBA)",
              registrationFee: 100,
            },
            {
              courseName: "MASTER OF COMPUTER APPLICATION(MCA)",
              registrationFee: 100,
            },
            {
              courseName: "DIPLOMA ENGINEERING",
              registrationFee: 100,
            },
            {
              courseName: "DIPLOMA PHARMACY",
              registrationFee: 100,
            },
          ],
        },
      ],
    });

    const savedCourse = await newFees.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post('/apitest/admin/EntranceFee2', async (req, res) => {
//   try {
//     const paymentsData = req.body.payments;

//     if (!Array.isArray(paymentsData)) {
//       return res.status(400).json({ error: 'Invalid data format. Expected an array of payments.' });
//     }

//     if (paymentsData.length === 0) {
//       return res.status(400).json({ error: 'No payment data provided.' });
//     }

//     const newPayments = [];

//     paymentsData.forEach(paymentData => {
//       const { EntranceSession, courseName, courseBranch, registrationFee } = paymentData;

//       const payment = new Fees2({
//         EntranceSession,
//         courseName,
//         courseBranch,
//         registrationFee
//       });

//       newPayments.push(payment);
//     });

//     await Fees2.insertMany(newPayments);

//     res.status(201).json({ message: 'Payment data created successfully' });
//   } catch (error) {
//     console.error('Error creating payment data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.post("/insertBulkData", async (req, res) => {
  try {
    const dataToInsert = req.body;

    // Use Mongoose model to insert data in bulk
    const data = await Fees.insertMany(dataToInsert);

    res.status(200).json({ message: "Bulk data inserted successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// router.get("/apitest/admin/fee/search", async (req, res) => {
//   try {
//     const { admissionSession, courseName, courseBranch } = req.query;

//     const feeInfo = await Fees.findOne({
//       admissionSession,
//       courseName,
//       courseBranch,
//     });

//     if (feeInfo) {
//       const { enrollmentFee, registrationFee } = feeInfo;
//       res.json({ enrollmentFee, registrationFee });
//     } else {
//       // If not found, send an error response
//       res.status(404).json({
//         error: "Fee information not found for the provided session and course.",
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching fee information:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });




router.get("/apitest/admin/fee/search", async (req, res) => {
  try {
    const { admissionSession, courseName, courseBranch } = req.query;

    // Generate a unique cache key based on the request parameters
    const cacheKey = `${admissionSession}_${courseName}_${courseBranch}`;

    // Check if data exists in cache
    const cachedFeeInfo = cache.get(cacheKey);
    if (cachedFeeInfo) {
      console.log("Fee information retrieved from cache");
      return res.json(cachedFeeInfo);
    }

    // If data doesn't exist in cache, fetch it from the database
    const feeInfo = await Fees.findOne({
      admissionSession,
      courseName,
      courseBranch,
    });

    if (feeInfo) {
      const { enrollmentFee, registrationFee } = feeInfo;
      // Set data in cache with a TTL of 60 seconds (adjust as needed)
      cache.set(cacheKey, { enrollmentFee, registrationFee }, 60);
      res.json({ enrollmentFee, registrationFee });
    } else {
      // If not found, send an error response
      res.status(404).json({
        error: "Fee information not found for the provided session and course.",
      });
    }
  } catch (error) {
    console.error("Error fetching fee information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

















//create scheme for semester 1

router.post("/createScheme", async (req, res) => {
  try {
    const { semesterNumber, courseType, courseName, courseBranch, subjects } =
      req.body;

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
    console.error("Error creating semester scheme:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/apitest/admin/status", VerifyAdmin ,async (req, res) => {
  const {
    assignedCollege,
    courseType,
    courseName,
    courseBranch,
    admissionSession,
  } = req.query;
  console.log(
    assignedCollege,
    courseName,
    courseBranch,
    admissionSession,
    "data"
  );
  try {
    if (!admissionSession && !courseType && !courseName && !courseBranch) {
      return res.status(400).json({
        message:
          "Cannot proceed with empty field . Please select options to search",
      });
    }

    const students = await User.find({
      courseBranch,
      admissionSession,
      courseName,
      courseType,
    });

    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





router.get("/apitest/admin/searchonlinepayments", VerifyAdmin , async (req, res) => {
  const { search } = req.query;

  try {
    // Construct a query object based on the general search string
    const query = {
      $or: [
        { randomId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: new RegExp(search.trim(), "i") } },
        { mobile: { $regex: search, $options: "i" } },
      ],
    };

    // Use the find method to search the database
    const result = await Payment.find(query);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/apitest/admin/epravesh-fee",  async (req, res) => {
  try {
    

    const newFees = new Fees3({
      sessions: [
        {
          sessionYear: "2024",
          courses: [
            {
              courseName: "BACHELOR OF ENGINEERING",
              // registrationFee: 1000,
              branches: [
                {
                  branchName: "AERONAUTICAL ENGINEERING",
                  registrationFee: 1500,
                },
                { branchName: "CHEMICAL ENGINEERING", registrationFee: 1600 },
                { branchName: "CIVIL ENGINEERING", registrationFee: 1500 },
                {
                  branchName: "COMPUTER SCIENCE AND ENGINEERING",
                  registrationFee: 1600,
                },
                {
                  branchName: "ELECTRICAL AND ELECTRONICS ENGINEERING",
                  registrationFee: 1500,
                },
                {
                  branchName: "ELECTRONICS AND COMMUNICATION ENGINEERING",
                  registrationFee: 1600,
                },
                {
                  branchName: "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
                  registrationFee: 1500,
                },
                { branchName: "MECHANICAL ENGINEERING", registrationFee: 1600 },
                { branchName: "MINING ENGINEERING", registrationFee: 1500 },
              ],
            },
            {
              courseName: "BACHELOR OF DESIGN",
              // registrationFee: 1200,
              branches: [
                { branchName: "INDUSTRIAL DESIGN", registrationFee: 1700 },
                { branchName: "COMMUNICATION DESIGN", registrationFee: 1800 },
                { branchName: "TEXTILE DESIGN", registrationFee: 1700 },
                { branchName: "INTERIOR DESIGN", registrationFee: 1800 },
                { branchName: "PRODUCT DESIGN", registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF DESIGN",
              // registrationFee: 1200,
              branches: [
                { branchName: "INDUSTRIAL DESIGN", registrationFee: 1700 },
                { branchName: "COMMUNICATION DESIGN", registrationFee: 1800 },
                { branchName: "TEXTILE DESIGN", registrationFee: 1700 },
                { branchName: "INTERIOR DESIGN", registrationFee: 1800 },
                { branchName: "PRODUCT DESIGN", registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF PHARMACY",
              // registrationFee: 1200,
              branches: [
                { branchName: "PHARMACY", registrationFee: 1700 },
                // { branchName: 'COMMUNICATION DESIGN',  registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF EDUCATION",
              // registrationFee: 1200,
              branches: [
                { branchName: "BACHELOR OF EDUCATION", registrationFee: 1700 },
                // { branchName: 'COMMUNICATION DESIGN',  registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName: "BSC(Nursing) SEMESTER",
              // registrationFee: 1200,
              branches: [
                { branchName: "Nursing", registrationFee: 1700 },
                // { branchName: 'COMMUNICATION DESIGN',  registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },

            {
              courseName: "BACHELOR OF HOTEL MANAGEMENT AND CATERING",
              // registrationFee: 1200,
              branches: [
                {
                  branchName: "HOTEL MANAGEMENT AND CATERING",
                  registrationFee: 1700,
                },
                // { branchName: 'COMMUNICATION DESIGN',  registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF PHYSICAL EDUCATION(B. P. Ed.)",
              // registrationFee: 1200,
              branches: [
                {
                  branchName: "BACHELOR OF PHYSICAL EDUCATION",
                  registrationFee: 1700,
                },
                // { branchName: 'COMMUNICATION DESIGN',  registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName:
                "BACHELOR OF ARTS BACHELOR OF EDUCATION (B. A. B. Ed.)",
              // registrationFee: 1200,
              branches: [
                {
                  branchName: "BACHELOR OF ARTS BACHELOR OF EDUCATION",
                  registrationFee: 1700,
                },
                // { branchName: 'COMMUNICATION DESIGN',  registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF COMMERCE",
              // registrationFee: 1200,
              branches: [
                { branchName: "COMPUTER APPLICATION", registrationFee: 1700 },
                { branchName: "PLAIN", registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF COMPUTER APPLICATION",
              // registrationFee: 1200,
              branches: [
                { branchName: "COMPUTER APPLICATION", registrationFee: 1700 },
                // { branchName: 'PLAIN',  registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF ARCHITECTURE",
              // registrationFee: 1200,
              branches: [
                { branchName: "ARCHITECTURE", registrationFee: 1700 },
                // { branchName: 'PLAIN',  registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF ARTS",
              // registrationFee: 1200,
              branches: [
                { branchName: "COMPUTER APPLICATION", registrationFee: 1700 },
                { branchName: "PLAIN", registrationFee: 1800 },
                // { branchName: 'TEXTILE DESIGN',registrationFee: 1700 },
                // { branchName: 'INTERIOR DESIGN',  registrationFee: 1800 },
                // { branchName: 'PRODUCT DESIGN',  registrationFee: 1800 },
              ],
            },
            {
              courseName: "BACHELOR OF SCIENCE",
              // registrationFee: 1200,
              branches: [
                {
                  branchName: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
                  registrationFee: 1700,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
                  registrationFee: 1800,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN BIOLOGY",
                  registrationFee: 1700,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN MATHEMATICS",
                  registrationFee: 1800,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN MICROBIOLOGY",
                  registrationFee: 1800,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN BIOCHEMISTRY",
                  registrationFee: 1800,
                },
              ],
            },
            {
              courseName: "BACHELOR OF SCIENCE",
              // registrationFee: 1200,
              branches: [
                {
                  branchName: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
                  registrationFee: 1700,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
                  registrationFee: 1800,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN BIOLOGY",
                  registrationFee: 1700,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN MATHEMATICS",
                  registrationFee: 1800,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN MICROBIOLOGY",
                  registrationFee: 1800,
                },
                {
                  branchName: "BACHELOR OF SCIENCE IN BIOCHEMISTRY",
                  registrationFee: 1800,
                },
              ],
            },

            {
              courseName: "MASTER OF TECHNOLOGY",
              // registrationFee: 1000,
              branches: [
                {
                  branchName: "COMPUTER TECHNOLOGY AND APPLICATION",
                  registrationFee: 1500,
                },
                { branchName: "INFORMATION TECHNOLOGY", registrationFee: 1600 },
                { branchName: "CIVIL ENGINEERING", registrationFee: 1500 },
                {
                  branchName: "COMPUTER SCIENCE AND ENGINEERING",
                  registrationFee: 1600,
                },
                {
                  branchName: "SOFTWARE ENGINEERING",
                  registrationFee: 1500,
                },
                {
                  branchName: "DIGITAL COMMUNICATION",
                  registrationFee: 1600,
                },
                {
                  branchName: "ELECTRICAL POWER SYSTEM",
                  registrationFee: 1500,
                },
                { branchName: "INDUSTRIAL DESIGN", registrationFee: 1600 },
                { branchName: "POWER ELECTRONICS", registrationFee: 1500 },
                { branchName: "STRUCTURAL DESIGN", registrationFee: 1500 },
                { branchName: "THERMAL ENGINEERING", registrationFee: 1500 },
                { branchName: "VLSI", registrationFee: 1500 },
              ],
            },

            {
              courseName: "MASTER OF PHARMACY",
              // registrationFee: 1200,
              branches: [
                { branchName: "PHARMACEUTICS", registrationFee: 1700 },
                { branchName: "PHARMACOLOGY", registrationFee: 1800 },
                //  { branchName: 'BACHELOR OF SCIENCE IN BIOLOGY',   registrationFee: 1700 },
                //  { branchName: 'BACHELOR OF SCIENCE IN MATHEMATICS',  registrationFee: 1800 },
                //  { branchName: 'BACHELOR OF SCIENCE IN MICROBIOLOGY',  registrationFee: 1800 },
                //  { branchName: 'BACHELOR OF SCIENCE IN BIOCHEMISTRY',  registrationFee: 1800 },
              ],
            },

            {
              courseName: "MASTER OF PHYSIOTHERAPHY (ORTHOPAEDIC)",
              // registrationFee: 1200,
              branches: [
                { branchName: "ORTHOPAEDIC", registrationFee: 1700 },
                //{ branchName: 'PHARMACOLOGY',  registrationFee: 1800 },
                //  { branchName: 'BACHELOR OF SCIENCE IN BIOLOGY',   registrationFee: 1700 },
                //  { branchName: 'BACHELOR OF SCIENCE IN MATHEMATICS',  registrationFee: 1800 },
                //  { branchName: 'BACHELOR OF SCIENCE IN MICROBIOLOGY',  registrationFee: 1800 },
                //  { branchName: 'BACHELOR OF SCIENCE IN BIOCHEMISTRY',  registrationFee: 1800 },
              ],
            },

            {
              courseName: "MASTER OF MEDICAL LAB TECHNOLOGY(MMLT)",
              // registrationFee: 1200,
              branches: [{ branchName: "HAEMOTOLOGY", registrationFee: 1700 }],
            },

            {
              courseName: "MASTER OF COMPUTER APPLICATION(MCA)",
              // registrationFee: 1200,
              branches: [
                { branchName: "COMPUTER APPLICATION", registrationFee: 1700 },
              ],
            },

            {
              courseName: "MASTER OF BUSINESS ADMINISTRATION(MBA) ",
              // registrationFee: 1200,
              branches: [
                { branchName: "HUMAN RESOURCES", registrationFee: 1700 },
              ],
            },

            {
              courseName: "DIPLOMA PHARMACY",
              // registrationFee: 1200,
              branches: [{ branchName: "PHARMACY", registrationFee: 1700 }],
            },

            {
              courseName: "DIPLOMA BLOOD TRANSFUSION",
              // registrationFee: 1200,
              branches: [
                { branchName: "BLOOD TRANSFUSION", registrationFee: 1700 },
              ],
            },

            {
              courseName: "DIPLOMA DIALYSIS TECHNICIAN",
              // registrationFee: 1200,
              branches: [
                { branchName: "DIALYSIS TECHNICIAN", registrationFee: 1700 },
              ],
            },

            {
              courseName: "DIPLOMA PHARMACY (AYURVED)",
              // registrationFee: 1200,
              branches: [{ branchName: "AYURVED", registrationFee: 1700 }],
            },
            {
              courseName: "DIPLOMA HUMAN NUTRITION",
              // registrationFee: 1200,
              branches: [
                { branchName: "HUMAN NUTRITION", registrationFee: 1700 },
              ],
            },
            {
              courseName: "DIPLOMA MEDICAL LAB AND TECHNICIAN",
              // registrationFee: 1200,
              branches: [
                { branchName: "MEDICAL LAB TECHNICIAN", registrationFee: 1700 },
              ],
            },
            {
              courseName: "DIPLOMA X-RAY RADIOGRAPHER TECHNICIAN",
              // registrationFee: 1200,
              branches: [
                {
                  branchName: "X-RAY RADIOGRAPHER TECHNICIAN",
                  registrationFee: 1700,
                },
              ],
            },
            {
              courseName: "DIPLOMA YOGA",
              // registrationFee: 1200,
              branches: [{ branchName: "YOGA", registrationFee: 1700 }],
            },
            {
              courseName: "DIPLOMA ENGINEERING",
              // registrationFee: 1200,
              branches: [
                { branchName: "CHEMICAL ENGINEERING", registrationFee: 1700 },
                { branchName: "CIVIL ENGINEERING", registrationFee: 1700 },
                {
                  branchName: "COMPUTER SCIENCE AND ENGINEERING",
                  registrationFee: 1700,
                },
                { branchName: "MECHANICAL ENGINEERING", registrationFee: 1700 },
              ],
            },
            {
              courseName: "DIPLOMA PHARMACY (HOMEOPATHY)",
              // registrationFee: 1200,
              branches: [{ branchName: "HOMEOPATHIC", registrationFee: 1700 }],
            },
            {
              courseName: "DIPLOMA PARAMEDICAL OPTHALMIC ASSISTENT",
              // registrationFee: 1200,
              branches: [{ branchName: "OPTHALMIC", registrationFee: 1700 }],
            },
            {
              courseName: "DIPLOMA ENGINEERING  (Lateral)",
              // registrationFee: 1200,
              branches: [
                { branchName: "CHEMICAL ENGINEERING", registrationFee: 1700 },
                { branchName: "CIVIL ENGINEERING", registrationFee: 1700 },
                {
                  branchName: "COMPUTER SCIENCE AND ENGINEERING",
                  registrationFee: 1700,
                },
                { branchName: "MECHANICAL ENGINEERING", registrationFee: 1700 },
              ],
            },
          ],
        },
      ],
    });

    const savedCourse = await newFees.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get('/payments/populate-student', async (req, res) => {
//   try {

//     await User;

//     const payments = await Payment.find().populate('student');
//     res.json(payments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get("/payments/populate-student", VerifyAdmin ,async (req, res) => {
  const { courseBranch } = req.body;
  try {
    const payments = await Payment.find({ courseBranch });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/apitest/admin/admissionSlip", VerifyAdmin , async (req, res) => {
  try {
    const { newAdmissionDate, studentIds } = req.body;
    console.log(studentIds, "student ki id ");
    console.log(newAdmissionDate, "student 's data ");

    const studentsToUpdate = await User.find({ _id: { $in: studentIds } });
    console.log(studentsToUpdate, "data");
    if (studentsToUpdate.length === 0) {
      return res.status(404).json({
        message: "No students found with the provided IDs and adminId.",
      });
    }

    await Promise.all(
      studentsToUpdate.map(async (student) => {
        student.admissionDate = newAdmissionDate;
        await student.save();
      })
    );

    res
      .status(200)
      .json({ message: "Admission session updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


 
router.post("/apitest/admin/admissionSlipsearch", VerifyAdmin , async (req, res) => {
  const { college, courseType, course, branch, session } = req.body;
  console.log(college, course, branch, session, "data ");
  try {
    if (!college && !session && !courseType && !course && !branch) {
      return res.status(400).json({
        message:
          "Cannot proceed with empty field . Please select options to search",
      });
    }

    const students = await User.find({
      courseBranch: branch,
      admissionSession: session,
      courseName: course,
      courseType,
      assignedCollege: college,
      isRegistered: true,
      IsEnrollGenerated: true,
      isPaid: true,
      isApproved: true,
    });

    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/apitest/admin/change-session", VerifyAdmin , async (req, res) => {
  const { admissionSession, randomId } = req.body;
  try {
    console.log(randomId);
    console.log(admissionSession, "admissionSession");
    // const studentd = await User.findOne({
    //   randomId:randomId
    // });

    //console.log(studentd, "student")
    const lastTwoDigits = admissionSession.slice(-2);

    function generateRandomNumberid(length) {
      const currentYear = new Date().getFullYear().toString().slice(-2);

      const randomNumber = Math.floor(
        Math.pow(10, length - 2) +
          Math.random() *
            (Math.pow(10, length - 1) - Math.pow(10, length - 2) - 1)
      );

      const random = lastTwoDigits + randomNumber.toString();
      return parseInt(random);
    }
    const randomNewId = generateRandomNumberid(9);

    console.log(randomNewId, "randomId");

    const studentd = await User.findOneAndUpdate(
      { randomId: randomId },
      { $set: { randomId: randomNewId, admissionSession: admissionSession } },
      { new: true }
    );

    console.log(studentd, "student data ");
    res.status(200).json(studentd);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get('/apitest/v2/admin/courses', async (req, res) => {
  try {
    // Extract session from query parameters
    const { session } = req.query;
   // console.log("session", session);

    // Ensure session is provided
    if (!session) {
      return res.status(400).json({ message: 'Session parameter is required' });
    }

    // Generate cache key
    const cacheKey = `session_courses_${session}`;

    // Check if data is cached
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
     // console.log("Data retrieved from cache");
      return res.status(200).json(cachedData);
    }

    // Fetch data from the database
    const sessionCourses = await Course2.find({ 
      admissionSession: session, 
      'courseNames.enabled': true, 
      'courseNames.branches.enabled': true 
    }).lean(); // Using lean() to get plain JavaScript objects

    // Cache the fetched data for 60 seconds
    cache.set(cacheKey, sessionCourses, 60);

    // Respond with the fetched data
    return res.json(sessionCourses);
  } catch (err) {
    // Log the error
    console.error("Error fetching courses:", err);
    
    // Send a server error response
    return res.status(500).json({ message: 'Server Error' });
  }
});



// router.get("/api/v2/admin/courses",  VerifyAdmin ,async (req, res) => {
//   const { session } = req.query;
//   console.log("session", session);
//   try {
//     const sessionCourses = await Course2.find({
//       admissionSession: session,
//       "courseNames.enabled": true,
//       "courseNames.branches.enabled": true,
//     });

//     // console.log("sessionCourses" ,sessionCourses)
//     // Send the response
//     res.json(sessionCourses);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });




//Api Using Caching

router.get("/api/v2/entrance", async (req, res) => {
  try {
    // Check if data exists in cache
    const cachedData = cache.get("entrance_data");
    if (cachedData) {
      console.log("Data retrieved from cache");
      return res.status(200).json({ User: cachedData });
    }

    const User = await Entrance.find();

    cache.set("entrance_data", User, 60);

    res.status(200).json({ User });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




// router.get("/api/v2/entrance" ,async (req, res) => {
//   try {
//     const User = await Entrance.find();

//     res.status(200).json({ User });
//   } catch (error) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });




router.put("/api/v2/entrance/verify-fee", VerifyAdmin, async(req, res) => {
    const {userId } = req.body
  try {

    const entrance = await Entrance.findOneAndUpdate(
      { _id: userId },
      { $set:{isPaid:true}},
      { new: true }
    );
   console.log(entrance , "data of entrance ")
    res.status(200).json({ entrance })

  } catch (error) {
    console.log(error , "error")
    res.status(500).json({ message: "Internal Server Error" });
  }
});








router.post("/apitest/admin/E-Pravesh/pendingstudentlist", VerifyAdmin ,  async (req, res) => {
  const {
  //  assignedCollege,
    courseType,
    courseName,
    courseBranch,
   // admissionSession,
  } = req.body;

  console.log(
   // assignedCollege,
    courseType,
    courseName,
    courseBranch,
    admissionSession,
    "data "
  );
  try {
    if (
      !assignedCollege &&
     // !admissionSession &&
      !courseType &&
      !courseName &&
      !courseBranch
    ) {
      return res.status(400).json({
        message:
          "Cannot proceed with empty field . Please select options to search",
      });
    }
    if (
      typeof courseName === "undefined" &&
      typeof courseType === "undefined" &&
      typeof courseBranch === "undefined" 
    
    ) {
      return res
        .status(400)
        .json({ message: "courseName is required for the search" });
    }

    const students = await User.find({
      courseBranch,
      // admissionSession,
      courseName,
      courseType,
      isRegistered: true,
      isApproved: false,
      StudentType:"EPravesh"
    });

    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.get('/api/v2/admin/courses/:session', async (req, res) => {
//   const { session } = req.params;

//   try {
//     console.log("session", session)
//     // Query the database for enabled courses of the given session
//     const sessionCourses = await Course2.find({
//       admissionSession: session,
//       'courseNames.enabled': true,

//     },
//     }).select('courseNames');

// const coursesData = sessionCourses.map(course => course.courseNames);

// console.log("sessionCourses", sessionCourses)
// // Send the response
// res.json(coursesData);
//   } catch (err) {
//   console.error(err);
//   res.status(500).json({ message: 'Server Error' });
// }
// });

module.exports = router;
