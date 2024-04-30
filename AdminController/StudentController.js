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





//Api for Searching student by randomId , Name , email 

const searchapi = async (req, res) => {
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
}





//Api for filtering student according to session , course , courseType , branch and college of the student 

const NewEnrollmentList = async (req, res) => {
    try {
        const { session, courseType, course, branch, college } = req.body;
        // console.log( courseType,
        //   course,
        //   branch,
        //   college , "data from query ")
        const students = await User.find({
            admissionSession: session,
            courseType,
            courseName: course,
            // courseBranch:branch,
            //assignedCollege:college,
            IsEnrollGenerated: false,
            isPaid: true
        });
        console.log({ students })
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}





//API for Getting the list of pending student for the  approval for particular course , courseType , courseBranch 
const PendingStudentList = async (req, res) => {
    const { assignedCollege, courseName, courseType, courseBranch, admissionSession } = req.body;
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
            isRegistered: true,
            isApproved: false
        });

        res.status(200).json({ students })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



//  API for Getting the list of Approved student for the  particular course , courseType , courseBranch 

const ApprovedStudentList = async (req, res) => {
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
}



//Api List of Enrolled Student 
const  TotalEnrolled = async (req, res) => {
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
            isPaid: true,
        });
        console.log(students)
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



//API Today 's  Registration Count  , Enrollment Count , Paid Count 

const TodayCount = async(req,res)=>{
    const today = new Date();
    today.setHours(0, 0, 0, 0);
      console.log(today)
    try {
      const count = await User.countDocuments({
        createdAt: { $gte: today },
  
      });
      const Totalcount = await User.countDocuments({
      });
       const TotalEnrolled = await User.countDocuments({
        isEnrolled:true
      });
      const paidStudentCount = await User.countDocuments({
        isPaid: true,
      });
      res.json({ count , Totalcount , paidStudentCount, TotalEnrolled});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}



//Api List of Total Student 

const TotalCountlist = async(req,res)=>{
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
}




//API : List of Total Paid Student

const PaidList = async (req,res)=>{

    try {
      const students = await User.find({
        isPaid:true,
  
      });
      res.json({ students });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}





//API : List of Total Paid Student

const EnrolledList = async (req,res)=>{
    try {
        const students = await User.find({
          isEnrolled:true,
        });
        res.json({ students });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

//API : Particular Student By unique Id (Primary Key )

const ParticularStudent = async (req,res)=>{
    const { userID } = req.query;
    console.log(req.query, "Query parameters");
    
    try {
      const Studentdata = await User.find({
        _id: userID,
      });
  
      console.log(Studentdata, "data of the student ");
      res.json({ Studentdata });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}





//API :Student according to Generated ID , EMAIL , NAME & MOBILE 
const Search2 = async (req,res)=>{

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
      const result = await User.find(query);
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}


//API :  






module.exports = { searchapi, Search2, NewEnrollmentList, ApprovedStudentList, PendingStudentList, EnrolledList  , TodayCount , TotalCountlist , PaidList}