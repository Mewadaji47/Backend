const express = require("express");
const router = new express.Router();
const HOD = require('../Modal/HOD')
const User = require('../Modal/Student')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const verifyHod = require('../middleware/verifyHod')
const { login, Register, NewRegistrationRequests, Enrollments, getstudentdetail, ApproveStudents } = require('../HodController/AuthCotroller')
const nodemailer = require('nodemailer')

router.post('/apitest/hod/login', async (req, res) => {
  try {
    const email = req.body.email;
    const Password = req.body.Password.trim();
    console.log(Password, "password")
    const user = await HOD.findOne({ email: email , Password:Password })
    // const isPassword = await HOD.findOne({
    //   Password
    // })

    // console.log("email", req.body.email, "password", req.body.
    //   Password
    // )
    // const isPassoword = await HOD.findOne({Password:Password})
    console.log(user, "user")
    if (!user ) {
      res.status(401).json({ message: 'Invalid login credentials' });

    } else {
      const UserResponse = {
        user: user._id,
        email: user.email,
        isHod: user.isHod,
        Branch: user.Branch
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie("access-token", token, {
        httpOnly: true,
        sameSite: "None"
      }).status(200).json({ UserResponse , token });
    }
  } catch (error) {
    console.log(error)
  }
})


router.post('/api/hod/register', (req, res) => {

  const { email, Branch, Password, mobile, Gender, isHod } = req.body;

  try {
    const savedUser = new HOD({
      email,
      Branch,
      mobile,
      Gender,
      isHod,
      Password

    });

    savedUser.save();

    res.status(200).json('Registered Successfully')
  } catch (err) {
    res.status(500).json(err)
  }
})
router.get('/api/NewRegistrationRequests', verifyHod, async (req, res) => {

  const { Branch } = req.query;

  try {

    const branchRegex = new RegExp(Branch.split(/\s+/).map(term => `(?=.*${term})`).join(''), 'i');
    console.log(branchRegex)
    const students = await User.find({
      courseBranch: branchRegex,

    });
    const approvedStudents = students.filter(student => student.isRegistered === true && student.isApproved === false);
    // console.log(approvedStudents)
    res.status(200).json({ students: approvedStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/api/getstudentdetail/:studentId', verifyHod, async (req, res) => {
  try {
    const studentId = req.params.studentId;

    //console.log(studentId);
    const student = await User.findOne({ _id: studentId }).select("-randomId -randomPassword");
    console.log(student);
    if (student) {
      res.status(200).json({ student });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong!" });
    console.log(error);
  }
});

router.get('/api/enrollement', async (req, res) => {

  const { Branch } = req.query;

  try {

    const branchRegex = new RegExp(Branch.split(/\s+/).map(term => `(?=.*${term})`).join(''), 'i');
    console.log(branchRegex)
    const students = await User.find({
      courseBranch: branchRegex
    });
    const approvedStudents = students.filter(student => student.isApproved === true);
    // console.log(approvedStudents)
    res.status(200).json({ students: approvedStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})










//Put Request 
router.put('/api/approve', verifyHod, async (req, res) => {
  const hodId = req.body.hodId
  const studentId = req.body.studentId;
  const assignedCollege = req.body.assignedCollege
  console.log('chale raha ', assignedCollege)
  try {
    const hod = await HOD.findById(hodId);
    //  console.log(hod)
    if (!hod) {
      return res.status(404).json({ error: 'HOD not found' });
    }

    if (!hod.isHod) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.isApproved) {
      return res.status(400).json({ error: 'Student is already approved' });
    }


    student.isApproved = true;
    student.assignedCollege = assignedCollege;
    await student.save();

    res.json({ message: 'Student approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/students/enrolledlist', verifyHod, async (req, res) => {
  const { branch } = req.query;
  try {
    const students = await User.find({
      courseBranch: branch,
      isRegistered: true,
      isEnrolled: true

    });
    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/api/students/today/list', verifyHod, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(today)
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




router.get('/api/students/today/list', verifyHod, async (req, res) => {

  const { branch } = req.query;
  try {
    const students = await User.find({
      courseBranch: branch,
      isRegistered: true,
      isEnrolled: true

    });
    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// router.get('/api/search', async (req, res) => {
//   const { randomId, email, name, session } = req.query;
//     //console.log(email)
//   try {
//     // Construct a query object based on search parameters
//     const query = {};
//     if ( randomId) query. randomId = { $regex:  randomId, $options: 'i' };
//     if (email) query.email = { $regex: email, $options: 'i' };
//    // if (name) query.name = { $regex: name, $options: 'i' };
//    if (name) query.name = { $regex: new RegExp(name.trim(), 'i') };
//     // if (session) query.session = { $regex: session, $options: 'i' };
//     console.log(query)
//     // Use the find method to search the database
//     const result = await User.find(query);

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/api/search2', verifyHod, async (req, res) => {
  const { search } = req.query;

  try {
    // Construct a query object based on the general search string
    const query = {
      $or: [
        { randomId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: new RegExp(search.trim(), 'i') } },
        // Add more fields as needed
      ],
    };

    // Use the find method to search the database
    const result = await User.find(query);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







router.get('/apitest/hod/students/branchtotallist', async (req, res) => {
  const { branch } = req.query;
  try {
    const students = await User.find({
      courseBranch: branch
    });
    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





router.get('/api/hod/cancel', async (req, res) => {
  const { studentId } = req.body;
  //console.log(studentId)
  try {

    const thestudent = await User.find({ _id: studentId })
    //console.log(thestudent[0].email)
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
      to: thestudent[0].email,
      subject: 'Approval Cancellation',
      html: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
          <h2 style="color: #0077b6;"> <h2 style="color: #0077b6;">Hello ${thestudent[0].name},</h2>,Unfortunately ! You are not eligible for the course you applied for  we have checked your documents which is not appropriate according to our eligibilty criteria .</div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);

      } else {
        console.log('Email sent: ' + info.response);
        res.json('Student request for Department Registration Has Been Cancelled !')
      }
    });


    //  res.json({thestudent})
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
})












router.get('/api/students/today/branchcount', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { branch } = req.query; // Extract branch from query parameters

  try {
    let query = {
      createdAt: {
        $gte: today.toISOString().split('T')[0],
      },
      courseBranch: branch,
      isRegistered: true,
    };
    let query2 = {

      isRegistered: true,
      isEnrolled: true
    };


    // If branch is provided, add it to the query

    const count = await User.countDocuments(query);
    const totalBranchCount = await User.countDocuments({ courseBranch: branch });
    const TotalEnrolledCount = await User.countDocuments(query2);
    res.json({ count, totalBranchCount, TotalEnrolledCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






// router.put('/api/updatestudent', async (req, res) => {
//   try {
//      const {

//         professionalFormData,
//         addressFormData,
//         educationFormData,
//         studentId
//      } = req.body;

//      console.log(professionalFormData, studentId);
//      const student = await User.findOneAndUpdate(

//         { _id: studentId },
//         {
//            $set: {
//               academicDetails: educationFormData,
//               address: addressFormData,
//               professional: professionalFormData,

//            },
//         },
//         { new: true }
//      );

//      if (!student) {
//         return res.status(404).json({ error: 'Student not found' });
//      }

//      res.json({ message: 'Student data updated successfully', student });

//   } catch (error) {
//      console.error('Error updating student data:', error);
//      res.status(500).json({ error: 'Internal server error' });
//   }
// });

//Routes 
/*
router.post('/api/hod/login' , login);
router.post('/api/hod/register' , Register)


//router.get('/api/hod/newregisterationrequests' ,NewRegistrationRequests)
router.get('/api/enrollement' , Enrollments)
router.get('/api/getstudentdetail/:studentId' , getstudentdetail)



router.put('/api/hod/approve' , ApproveStudents)*/

module.exports = router;