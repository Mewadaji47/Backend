// const express = require("express");
// const router = new express.Router();
// const nodemailer = require("nodemailer");
// const User = require('../Modal/Student')
// const Course = require('../Modal/NewCourse.js')
// const accountSid = "ACa60103fb9614f07d1c16a0ef6a47c420";
// const authToken = "dc4276c12a90f3146ad96cfc2a9c5d26";
// const client = require('twilio')(accountSid, authToken);
// const axios = require('axios');
// const Eligibility = require('../Modal/Eligibility.js');
// const otpStorage = new Map();
// const otpStorage2 = new Map();
// const jwt = require('jsonwebtoken')



// //This is the function which is sending otp for mobile 
// async function sendSMS(mobile, message) {
//    try {
//       const smsRes = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
//          params: {
//             authorization: 'pYJBnhQN2EtXLRWFf39ZxvdHSwCTlkoP45e17yagIsKGDcMUrmRfQkzU6Z5rPsxJieKgHIbcB1MLuldT',
//             message: message,
//             language: "english",
//             route: "q",
//             numbers: mobile,
//          },
//          headers: {
//             'cache-control': 'no-cache',
//          },
//       });


//       return smsRes.data;
//       console.log("SMS sent successfully");
//    } catch (error) {
//       console.error(error);
//       throw new Error('Failed to send SMS');
//    }
// }
// router.post('/send-otp', async (req, res) => {
//    const { email, otp, mobile } = req.body;

//    try {
//       const emailverified = await User.findOne({ email: email })
//       if (emailverified) {
//          res.status(400).json('This email is already exists')
//       }
//       else {
//          if (!otp) {
//             const generatedOTP = generateOTP();
//             sendEmail(email, `Your OTP is: ${generatedOTP}`);
//             sendSMS(mobile, `Your  OTP is  :  ${generatedOTP}`)



//             const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
//             otpStorage.set(email, { otp: generatedOTP, expirationTime });

//             res.status(201).json({ status: 201, message: 'OTP sent' });
//          } else {
//             // Verify the provided OTP
//             const isOTPValid = verifyOTP(email, otp);
//             console.log(isOTPValid, 'isotpvalid')

//             if (isOTPValid) {
//                console.log('Email sent successfully');
//                res.status(201).json({ status: 201, message: 'Email sent successfully' });
//             } else {
//                console.log('Invalid OTP');
//                res.status(401).json({ status: 401, message: 'Invalid OTP' });
//             }
//          }
//       }
//    } catch (error) {
//       console.error(error);
//       res.status(500).json({ status: 500, error: 'Server error' });
//    }
// });

// function generateOTP() {

//    return Math.floor(100000 + Math.random() * 900000).toString();
// }

// async function sendEmail(email, content) {
//    const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//          user: process.env.EMAIL,
//          pass: process.env.PASSWORD,
//       },
//    });

//    const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "OTP Confirmation",
//       text: `Your OTP: ${content}`,
//    };
//    return new Promise((resolve, reject) => {
//       transporter.sendMail(mailOptions, (error, info) => {
//          if (error) {
//             console.error("Error:", error);
//             reject(error);
//          } else {
//             console.log("Email sent:", info.response);
//             resolve(info.response);
//          }
//       });
//    });
// }
// function verifyOTP(email, enteredOTP) {
//    const storedOTPData = otpStorage.get(email);

//    if (storedOTPData && Date.now() < storedOTPData.expirationTime) {
//       return enteredOTP === storedOTPData.otp;
//    }

//    return false;
// }

// router.post('/verify-otp', (req, res) => {
//    const { email, otp } = req.body;
//    console.log(email)
//    try {
//       const isOTPValid = verifyOTP(email, otp);
//       console.log(otp)
//       if (isOTPValid) {
//          res.status(200).json({ status: 200, message: 'OTP verified successfully' });
//       } else {
//          res.status(401).json({ status: 401, message: 'Invalid OTP' });
//       }
//    } catch (error) {
//       console.error(error);
//       res.status(500).json({ status: 500, error: 'Server error' });
//    }
// });
// function generateRandomNumberid(length) {
//    const currentYear = new Date().getFullYear().toString().slice(-2);

//    const randomNumber = Math.floor(Math.pow(10, length - 2) + Math.random() * (Math.pow(10, length - 1) - Math.pow(10, length - 2) - 1));

//    const random = currentYear + randomNumber.toString();
//    return parseInt(random);
// }
// const randomId = generateRandomNumberid(9);



// async function sendIdPass(randomId, randomPassword, email, name) {
//    const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//          user: process.env.EMAIL,
//          pass: process.env.PASSWORD,
//       },
//    });

//    const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Registration Successfull",
//       text: `Hello ${name} , Your Registration  has been confirmed with Sri Satya Sai University of Technology and Medical Sciences, Sehore , Your Registration No is ${randomId} and password is <b>${randomPassword}`,
//    };
//    return new Promise((resolve, reject) => {
//       transporter.sendMail(mailOptions, (error, info) => {
//          if (error) {
//             console.error("Error:", error);
//             reject(error);
//          } else {
//             console.log("Email sent:", info.response);
//             resolve(info.response);
//          }
//       });
//    });
// }
// router.post('/register', (req, res) => {
//    const randomId = generateRandomNumberid(9); // Generates a random UUID
//    const randomPassword = generateRandomNumberid(8);
//    const { email, name, dob, mothersname, fathersname, mobile } = req.body;
//    console.log(email, name, dob, mothersname, fathersname, "data")

//    try {
//       if (mobile && mobile.length !== 10) {

//          return res.status(401).json({ status: 401, error: 'Mobile number must be 10 digits' });
//       }
//       const savedUser = new User({
//          email,
//          name,
//          dob,
//          fathersname,
//          mothersname,
//          mobile,
//          randomId,
//          randomPassword,
//          isApproved: false,
//          isEnrolled: false

//       });
//       if (mobile && mobile.length !== 10) {
//          res.status(401).json({ status: 400, error: 'Mobile number must be 10 digits' });
//       }

//       savedUser.save();
//       sendIdPass(randomId, randomPassword, email, name)
//       res.status(200).json({ status: 200, message: 'Registered Successfully' })
//    } catch (err) {
//       res.status(500).json(err)
//    }
// })

// // router.post('/login', async (req, res) => {

// //    const { randomId, randomPassword } = req.body;
// //    try {
// //       const user = await User.findOne({ randomId: randomId, randomPassword: randomPassword }).select("-randomId -randomPassword");

// //       if (user) {
// //          /*  const UserResponse = {
// //               user:user._id , 
// //               username:user.name ,
// //               email:user.email ,
// //               dob:user.dob ,
// //               isApproved:user.isApproved,
// //               isRegistered:user.isRegistered,
// //               fathersname:user.fathersname,
// //               mothersname:user.mothersname,
// //               mobile:user.mobile
// //            }*/
// //          const UserResponse = user

// //          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //          const option = {
// //             httpOnly: true,
// //             secure: false,

// //             path: '/',

// //          };
// //          res.cookie("accessToken", token, option).status(200).json({ message: 'Login successful', UserResponse });
// //       } else {
// //          res.status(401).json({ message: 'Invalid login credentials' });
// //       }
// //    } catch (err) {
// //       res.status(500).json({ message: 'Something went wrong' });
// //       console.error(err);
// //    }
// // })

// router.post('/login', async (req, res) => {
//    const { randomId, randomPassword, enrollment } = req.body;

//    try {
//      let user;

//      // Check if randomId is provided
//      if (randomId) {
//        user = await User.findOne({ randomId: randomId, randomPassword: randomPassword }).select("-randomId -randomPassword");
//      }

//      // If randomId is not provided or the user is not found, check by enrollment
//      if (!user && enrollment) {
//        user = await User.findOne({ enrollment: enrollment, randomPassword: randomPassword }).select("-randomId -randomPassword");
//      }

//      if (user) {
//        const UserResponse = user;

//        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
//        const option = {
//          httpOnly: true,
//          secure: true,

//        };
//        res.cookie("accessToken", token, option).status(200).json({ message: 'Login successful', UserResponse });
//      } else {
//        res.status(401).json({ message: 'Invalid login credentials' });
//      }
//    } catch (err) {
//      res.status(500).json({ message: 'Something went wrong' });
//      console.error(err);
//    }
//  });



// //Register Updates
// router.put('/registerupdates', async (req, res) => {
//    const {  marksheet12th , courseName, courseType, courseBranch, eligibility,
//       domicile, gender, lastExamType, qualification, category, qualificationPercentage, nationality, passingYear, qualifyingEntranceExam, entranceBasedTypeExam } = req.body
//        console.log(marksheet12th  , "fileurl ")
//       try {
//       const data = {
//          courseName, courseType, courseBranch, eligibility,
//          domicile, gender, lastExamType, qualification, category, qualificationPercentage, isRegistered: true, passingYear, nationality
//       }
//       // if (
//       //    [ courseName, courseType, courseBranch, eligibility,
//       //       domicile, gender, lastExamType, qualification, category, qualificationPercentage, nationality, passingYear, qualifyingEntranceExam, entranceBasedTypeExam].some((field) => field?.trim() === "")
//       // ) {
//       //    return res.status(400).json({ message: "All Field are Required!" })
//       // }

//       const id = req.body.id
//       const updatedStudent = await User.findByIdAndUpdate(id, { $set: data  , "Documents.marksheet12th":marksheet12th} , { new: true })
//       res.status(200).json(updatedStudent)
//    } catch (err) {
//       res.status(500).json('Something Went Wrong!')
//       console.log(err)
//    }
// })


// /////////////////ENROLLMENT DATA ///////////////////////////////////



// // router.put('/updatestudent', async (req, res) => {
// //    try {

// //      const {
// //        fileUrls,
// //        professionalFormData,
// //        addressFormData,
// //        educationFormData,
// //        studentId
// //      } = req.body;
// //   console.log(professionalFormData , addressFormData , educationFormData , fileUrls,  "data to a rela hai ")
// //      console.log(studentId)
// //      const student = await User.findOneAndUpdate(

// //        { _id:studentId },
// //        {
// //          $set: {
// //            academicDetails: educationFormData,
// //            address: addressFormData,
// //            professional: professionalFormData,
// //            Documents:fileUrls
// //          },
// //        },
// //        { new: true } 
// //      );

// //      if (!student) {
// //        return res.status(404).json({ error: 'Student not found' });
// //      }

// //      res.json({ message: 'Student data updated successfully', student });
// //    } catch (error) {
// //      console.error('Error updating student data:', error);
// //      res.status(500).json({ error: 'Internal server error' });
// //    }
// //  });

// router.put('/updatestudent', async (req, res) => {
//    try {
//       const {
//          fileUrls,
//          professionalFormData,
//          addressFormData,
//          educationFormData,
//          studentId
//       } = req.body;

//       // Check for missing data
//       // if (!professionalFormData) {
//       //    return res.status(400).json({ error: 'All fields are required' });
//       // }

//       // Validate data types
//       const errors = [];



//       const validateNumber = (field, fieldName, length) => {
//          const fieldValue = professionalFormData[field].toString();
//          if (fieldValue !== "nill" && (!/^\d+$/.test(fieldValue) || fieldValue.length !== length)) {
//             errors.push(`Invalid ${fieldName}`);
//          }
//       };



//       let isRequiredFieldsErrorAdded = false;

//       const validateNotBlank = (field, fieldName, formData) => {
//          if (!formData[field] && !isRequiredFieldsErrorAdded) {
//             errors.push(`Please Fill All the Required Fields`);
//             isRequiredFieldsErrorAdded = true;
//          }
//       };
//       const validateFileUrls = (fileUrls, field) => {
//          const allowedExtensions = ['jpg', 'jpeg', 'png'];

//          Object.keys(fileUrls).forEach((key) => {
//             const url = fileUrls[key];
//             const extension = url.split('.').pop().toLowerCase();

//             if (!allowedExtensions.includes(extension)) {
//                errors.push(`Invalid file format for ${field}.${key}`);
//             }
//          });
//       };
//       validateFileUrls(fileUrls, 'applicantPhoto');
//       validateFileUrls(fileUrls, 'applicantSignature');
//       // validateNotBlank('Handicapped', 'Handicapped', professionalFormData);
//       // validateNotBlank('Medium', 'Medium', professionalFormData);
//       // validateNotBlank('Nationality', 'Nationality', professionalFormData);
//       // validateNotBlank('Domicile', 'Domicile', professionalFormData);
//       // validateNotBlank('ScholarshipRequired', 'ScholarshipRequired', professionalFormData);
//       // validateNotBlank('FathersOccupation', 'FathersOccupation', professionalFormData);
//       // validateNotBlank('MothersOccupation', 'MothersOccupation', professionalFormData);
//       // validateNotBlank('address1', 'Address Line 1', addressFormData);
//       // validateNotBlank('country', 'Country', addressFormData);
//       // validateNotBlank('state', 'State', addressFormData);
//       // validateNotBlank('district', 'District', addressFormData);
//       // validateNotBlank('pincode', 'Pincode', addressFormData);


//       // validateNumber('SamagraId', 'SamagraId', 9);
//       // validateNumber('AadharNumber', 'AadharNumber', 12);

//       // validateNumber('ParentMobile', 'ParentMobile', 10);

//       if (errors.length > 0) {
//          return res.status(400).json({ errors });
//       }

//       console.log(professionalFormData, studentId);
//       const student = await User.findOneAndUpdate(

//          { _id: studentId },
//          {
//             $set: {
//                academicDetails: educationFormData,
//                address: addressFormData,
//                professional: professionalFormData,
//                Documents: fileUrls
//             },
//          },
//          { new: true }
//       );

//       if (!student) {
//          return res.status(404).json({ error: 'Student not found' });
//       }

//       res.json({ message: 'Student data updated successfully', student });

//    } catch (error) {
//       console.error('Error updating student data:', error);
//       res.status(500).json({ error: 'Internal server error' });
//    }
// });






// router.post('/eligibilityacc', async (req, res) => {
//    const { CourseName, CourseType, CourseBranch } = req.body;

//    try {
//       const course = await Course.findOne({ CourseName, CourseType, CourseBranch });
//       if (course) {
//          return res.json({ eligibility: course.Eligibility });
//       } else {
//          return res.json({ eligibility: 'Not found' });
//       }
//    } catch (error) {
//       return res.status(500).json({ error: 'Internal Server Error' });
//    }
// })







// module.exports = router;






const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");
const User = require('../Modal/Student')
const Course = require('../Modal/NewCourse.js')
const axios = require('axios');
const Eligibility = require('../Modal/Eligibility.js');
const otpStorage = new Map();
const jwt = require('jsonwebtoken');

// async function sendSMS(mobile, message) {
//    try {
//       const smsRes = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
//          params: {
//             authorization: 'pYJBnhQN2EtXLRWFf39ZxvdHSwCTlkoP45e17yagIsKGDcMUrmRfQkzU6Z5rPsxJieKgHIbcB1MLuldT',
//             message: message,
//             language: "english",
//             route: "q",
//             numbers: mobile,
//          },
//          headers: {
//             'cache-control': 'no-cache',
//          },
//       });


//       return smsRes.data;
//       console.log("SMS sent successfully");
//    } catch (error) {
//       console.error(error);
//       throw new Error('Failed to send SMS');
//    }
// }

router.post('/api/send-otp', async (req, res) => {
   const { email, otp, mobile } = req.body;

   try {
      const emailverified = await User.findOne({ email: email })
      if (emailverified) {
         res.status(400).json('This email is already exists')
      }
      else {
         if (!otp) {
            const generatedOTP = generateOTP();
            sendEmail(email, `${generatedOTP}`);
            // sendSMS(mobile , `Your  OTP is  :  ${generatedOTP}`)



            const expirationTime = Date.now() + 1 * 60 * 1000; // 5 minutes
            otpStorage.set(email, { otp: generatedOTP, expirationTime });

            res.status(201).json({ status: 201, message: 'OTP sent' });
         } else {
            // Verify the provided OTP
            const isOTPValid = verifyOTP(email, otp);
            console.log(isOTPValid, 'isotpvalid')

            if (isOTPValid) {
               console.log('Email sent successfully');
               res.status(201).json({ status: 201, message: 'Email sent successfully' });
            } else {
               console.log('Invalid OTP');
               res.status(401).json({ status: 401, message: 'Invalid OTP' });
            }
         }
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, error: 'Server error' });
   }
});

function generateOTP() {

   return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail(email, content) {
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
      to: email,
      subject: "OTP Confirmation",
      html: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
      <h2 style="color:#0077b6; font-size:25px">Hello Dear,</h2>
      <p>Your OTP For Registration is :  <b>${content}</b></p>
    </div>`,
   };
   return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            console.error("Error:", error);
            reject(error);
         } else {
            console.log("Email sent:", info.response);
            resolve(info.response);
         }
      });
   });
}
function verifyOTP(email, enteredOTP) {
   const storedOTPData = otpStorage.get(email);

   if (storedOTPData && Date.now() < storedOTPData.expirationTime) {
      return enteredOTP === storedOTPData.otp;
   }

   return false;
}

router.post('/api/verify-otp', (req, res) => {
   const { email, otp } = req.body;
   console.log(email)
   try {
      const isOTPValid = verifyOTP(email, otp);
      console.log(otp)
      if (isOTPValid) {
         res.status(200).json({ status: 200, message: 'OTP verified successfully' });
      } else {
         res.status(401).json({ status: 401, message: 'Invalid OTP' });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, error: 'Server error' });
   }
});
function generateRandomNumberid(length) {
   const currentYear = new Date().getFullYear().toString().slice(-2);

   const randomNumber = Math.floor(Math.pow(10, length - 2) + Math.random() * (Math.pow(10, length - 1) - Math.pow(10, length - 2) - 1));

   const random = currentYear + randomNumber.toString();
   return parseInt(random);
}
const randomId = generateRandomNumberid(9);



async function sendIdPass(randomId, randomPassword, email, name) {
   const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD,
      },
   });

   const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Registration Successfull",
      html: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
           <h2 style="color: #0077b6;">Hello ${name},</h2>
           <p>Your registration has been confirmed with Sri Satya Sai University of Technology and Medical Sciences, Sehore.</p>
           <p>Your Registration No is <strong>${randomId}</strong> and password is <strong>${randomPassword}</strong></p>
         </div>`
   };

   return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
            console.error("Error:", error);
            reject(error);
         } else {
            console.log("Email sent:", info.response);
            resolve(info.response);
         }
      });
   });
}
router.post('/api/register', (req, res) => {
   const randomId = generateRandomNumberid(9); // Generates a random UUID
   const randomPassword = generateRandomNumberid(8);
   const { email, name, dob, mothersname, fathersname, mobile } = req.body;
   console.log(email, name, dob, mothersname, fathersname, "data")

   try {
      if (mobile && mobile.length !== 10) {

         return res.status(401).json({ status: 401, error: 'Mobile number must be 10 digits' });
      }
      const savedUser = new User({
         email,
         name,
         dob,
         fathersname,
         mothersname,
         mobile,
         randomId,
         randomPassword,
         isApproved: false,
         isEnrolled: false

      });
      if (mobile && mobile.length !== 10) {
         res.status(401).json({ status: 400, error: 'Mobile number must be 10 digits' });
      }

      savedUser.save();
      sendIdPass(randomId, randomPassword, email, name)
      res.status(200).json({ status: 200, message: 'Registered Successfully' })
   } catch (err) {
      res.status(500).json(err)
   }
})

router.post('/api/login', async (req, res) => {

   const { randomId, randomPassword } = req.body;
   try {
      const user = await User.findOne({ randomId: randomId, randomPassword: randomPassword }).select("-randomId -randomPassword");

      if (user) {
         /*  const UserResponse = {
              user:user._id , 
              username:user.name ,
              email:user.email ,
              dob:user.dob ,
              isApproved:user.isApproved,
              isRegistered:user.isRegistered,
              fathersname:user.fathersname,
              mothersname:user.mothersname,
              mobile:user.mobile
           }*/
         const UserResponse = user

         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

         const option = {
        
          httpOnly: true,
          secure: false,
      };
         res.cookie("accessToken", token, option).status(200).json({ message: 'Login successful', UserResponse });
      } else {
         res.status(401).json({ message: 'Invalid login credentials' });
      }
   } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
      console.error(err);
   }
})





//Register Updates
router.put('/registerupdates', async (req, res) => {
   const { marksheet12th, courseName, courseType, courseBranch, eligibility,
      domicile, gender, lastExamType, qualification, category, qualificationPercentage, nationality, passingYear, qualifyingEntranceExam, entranceBasedTypeExam } = req.body
   console.log(marksheet12th, "fileurl ")
   try {
      const data = {
         courseName, courseType, courseBranch, eligibility,
         domicile, gender, lastExamType, qualification, category, qualificationPercentage, isRegistered: true, passingYear, nationality
      }
      // if (
      //    [ courseName, courseType, courseBranch, eligibility,
      //       domicile, gender, lastExamType, qualification, category, qualificationPercentage, nationality, passingYear, qualifyingEntranceExam, entranceBasedTypeExam].some((field) => field?.trim() === "")
      // ) {
      //    return res.status(400).json({ message: "All Field are Required!" })
      // }

      const id = req.body.id
      const updatedStudent = await User.findByIdAndUpdate(id, { $set: data, "Documents.marksheet12th": marksheet12th }, { new: true })
      res.status(200).json(updatedStudent)
   } catch (err) {
      res.status(500).json('Something Went Wrong!')
      console.log(err)
   }
})
// router.put('/api/registerupdates', async(req, res) => {
//   const { courseName, courseType, courseBranch, eligibility,
//       domicile, gender, lastExamType, qualification, category, qualificationPercentage, nationality, passingYear, qualifyingEntranceExam, entranceBasedTypeExam ,admissionSession,QualifiedCourse } = req.body
//   try {
//       const data = {
//          courseName, courseType, courseBranch, eligibility,
//          domicile, gender, lastExamType, qualification, category, qualificationPercentage, isRegistered: true, passingYear, nationality, admissionSession,QualifiedCourse}

//       const id = req.body.id
//       const updatedStudent = await User.findByIdAndUpdate(id, { $set: data }, { new: true })
//       res.status(200).json(updatedStudent)
//   } catch (err) {
//       res.status(500).json('Something Went Wrong!')
//       console.log(err)
//   }
// })


/////////////////ENROLLMENT DATA ///////////////////////////////////



// router.put('/updatestudent', async (req, res) => {
//    try {

//      const {
//        fileUrls,
//        professionalFormData,
//        addressFormData,
//        educationFormData,
//        studentId
//      } = req.body;
//   console.log(professionalFormData , addressFormData , educationFormData , fileUrls,  "data to a rela hai ")
//      console.log(studentId)
//      const student = await User.findOneAndUpdate(

//        { _id:studentId },
//        {
//          $set: {
//            academicDetails: educationFormData,
//            address: addressFormData,
//            professional: professionalFormData,
//            Documents:fileUrls
//          },
//        },
//        { new: true } 
//      );

//      if (!student) {
//        return res.status(404).json({ error: 'Student not found' });
//      }

//      res.json({ message: 'Student data updated successfully', student });
//    } catch (error) {
//      console.error('Error updating student data:', error);
//      res.status(500).json({ error: 'Internal server error' });
//    }
//  });

router.put('/api/updatestudent', async (req, res) => {
   try {
      const {
         fileUrls,
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
      const errors = [];



      const validateNumber = (field, fieldName, length) => {
         const fieldValue = professionalFormData[field].toString();
         if (fieldValue !== "nill" && (!/^\d+$/.test(fieldValue) || fieldValue.length !== length)) {
            errors.push(`Invalid ${fieldName}`);
         }
      };



      let isRequiredFieldsErrorAdded = false;

      const validateNotBlank = (field, fieldName, formData) => {
         if (!formData[field] && !isRequiredFieldsErrorAdded) {
            errors.push(`Please Fill All the Required Fields`);
            isRequiredFieldsErrorAdded = true;
         }
      };


      const validateFileUrls = (fileUrls, fields) => {
         const requiredFields = fields.filter(field => !fileUrls[field]);
         if (requiredFields.length > 0) {
            errors.push(`Please provide URLs for the following required fields`);
         }
      };

      const requiredFileFields = [
         'applicantPhoto',
         'applicantSignature',
         'aadharCard',
         'marksheet10th',
         'marksheet12th',
         'domicileCertificate',
         'transferCertificate',
         'incomeCertificate',
         'migrationCertificate',

      ];

      validateFileUrls(fileUrls, requiredFileFields);
      validateNotBlank('Handicapped', 'Handicapped', professionalFormData);
      validateNotBlank('Medium', 'Medium', professionalFormData);
      validateNotBlank('Nationality', 'Nationality', professionalFormData);
      ('Domicile', 'Domicile', professionalFormData);
      // validateNotBlank('ScholarshipRequired', 'ScholarshipRequired', professionalFormData);
      validateNotBlank('FathersOccupation', 'FathersOccupation', professionalFormData);
      validateNotBlank('MothersOccupation', 'MothersOccupation', professionalFormData);
      validateNotBlank('address1', 'Address Line 1', addressFormData);
      validateNotBlank('country', 'country', addressFormData);
      validateNotBlank('state', 'state', addressFormData);
      validateNotBlank('district', 'district', addressFormData);
      validateNotBlank('pinCode', 'pinCode', addressFormData);


      // validateNumber('SamagraId', 'SamagraId', 9);
      validateNumber('AadharNumber', 'AadharNumber', 12);

      validateNumber('ParentMobile', 'ParentMobile', 10);

      if (errors.length > 0) {
         return res.status(400).json({ errors });
      }

      console.log(professionalFormData, studentId);
      const student = await User.findOneAndUpdate(

         { _id: studentId },
         {
            $set: {
               academicDetails: educationFormData,
               address: addressFormData,
               professional: professionalFormData,
               Documents: fileUrls,
               isEnrolled: true
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







module.exports = router;



