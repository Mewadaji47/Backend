const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");
const User = require("../Modal/Student");
const Course = require("../Modal/NewCourse.js");
const axios = require("axios");
const Eligibility = require("../Modal/Eligibility.js");
const otpStorage = new Map();
const jwt = require("jsonwebtoken");
const Entrace = require("../Modal/EntranceDetails");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const Fees = require('../Modal/Fees.js')



const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10, 
  message: "Too many requests from this IP, please try again later",
  headers: true,
});



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







router.post("/api/send-otp", async (req, res) => {
  const { email, otp, mobile } = req.body;

  try {
    const emailverified = await User.findOne({ email: email });
    if (emailverified) {
      res
        .status(400)
        .json({ status: 400, message: "This Email is Already exists" });
    } else {
      if (!otp) {
        const generatedOTP = generateOTP();
        sendEmail(email, `${generatedOTP}`);
        // sendSMS(mobile , `Your  OTP is  :  ${generatedOTP}`)

        const expirationTime = Date.now() + 1 * 60 * 1000; // 5 minutes
        otpStorage.set(email, { otp: generatedOTP, expirationTime });

        res.status(201).json({ status: 201, message: "OTP sent" });
      } else {
        // Verify the provided OTP
        const isOTPValid = verifyOTP(email, otp);
        console.log(isOTPValid, "isotpvalid");

        if (isOTPValid) {
          console.log("Email sent successfully");
          res
            .status(201)
            .json({ status: 201, message: "Email sent successfully" });
        } else {
          console.log("Invalid OTP");
          res.status(401).json({ status: 401, message: "Invalid OTP" });
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Server error" });
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
  const Sender = process.env.SENDER_EMAIL;
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



router.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  console.log(email);

  try {
    const isOTPValid = verifyOTP(email, otp);
    console.log(otp);
    if (isOTPValid) {
      res
        .status(200)
        .json({ status: 200, message: "OTP verified successfully" });
    } else {
      res.status(401).json({ status: 401, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: "Server error" });
  }
});





function generateRandomNumberid(length) {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  const randomNumber = Math.floor(
    Math.pow(10, length - 2) +
      Math.random() * (Math.pow(10, length - 1) - Math.pow(10, length - 2) - 1)
  );

  const random = currentYear + randomNumber.toString();
  return parseInt(random);
}
// const randomId = generateRandomNumberid(9);

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

//E-Pravesh  Send OTP
// router.post('/api/send-otp', async (req, res) => {
//    const { email, otp } = req.body;

//    try {
//       const emailverified = await User.findOne({ email: email })
//       if (emailverified) {
//          res.status(400).json({ status: 400, message: 'This Email is Already exists' })
//       }
//       else {
//          if (!otp) {
//             const generatedOTP = generateOTP();
//             sendEmail(email, `${generatedOTP}`);
//             // sendSMS(mobile , `Your  OTP is  :  ${generatedOTP}`)

//             const expirationTime = Date.now() + 1 * 60 * 1000; // 5 minutes
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

router.post("/api/register", limiter, (req, res) => {
  const randomId = generateRandomNumberid(9); // Generates a random UUID
  const randomPassword = generateRandomNumberid(8);
  const { email, name, dob, mothersname, fathersname, mobile } = req.body;
  console.log(email, name, dob, mothersname, fathersname, "data");

  try {
    if (mobile && mobile.length !== 10) {
      return res
        .status(401)
        .json({ status: 401, error: "Mobile number must be 10 digits" });
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
      isEnrolled: false,
    });
    if (mobile && mobile.length !== 10) {
      res
        .status(401)
        .json({ status: 400, error: "Mobile number must be 10 digits" });
    }

    savedUser.save();
    sendIdPass(randomId, randomPassword, email, name);
    res.status(200).json({ status: 200, message: "Registered Successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});



router.post("/api/login", limiter ,async (req, res) => {
  const { Id, randomPassword } = req.body;
  try {
    let user;
    if (Id) {
      // If Id is provided, check both randomId and enrollmentNumber
      user = await User.findOne({
        $or: [
          { randomId: Id, randomPassword: randomPassword },
          { enrollmentNumber: Id, randomPassword: randomPassword },
        ],
      }).select("-randomId -randomPassword");
    }

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
      const UserResponse = user;

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const option = {
        expires: new Date(Date.now() + 3600000),
        httpOnly: false,
        secure: true,
        sameSite: "None",
        //   domain:'sssutms.ac.in'
      };

      res
        .cookie("accessToken", token, option)
        .status(200)
        .json({ message: "Login successful", UserResponse });
    } else {
      res.status(401).json({ message: "Invalid login credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.error(err);
  }
});




//Register Updates
router.put("/registerupdates", limiter, async (req, res) => {
  const {
    marksheet12th,
    courseName,
    courseType,
    courseBranch,
    eligibility,
    domicile,
    gender,
    lastExamType,
    qualification,
    category,
    qualificationPercentage,
    nationality,
    passingYear,
    qualifyingEntranceExam,
    entranceBasedTypeExam,
  } = req.body;
  console.log(marksheet12th, "fileurl ");
  try {
    const data = {
      courseName,
      courseType,
      courseBranch,
      eligibility,
      domicile,
      gender,
      lastExamType,
      qualification,
      category,
      qualificationPercentage,
      isRegistered: true,
      passingYear,
      nationality,
    };
    // if (
    //    [ courseName, courseType, courseBranch, eligibility,
    //       domicile, gender, lastExamType, qualification, category, qualificationPercentage, nationality, passingYear, qualifyingEntranceExam, entranceBasedTypeExam].some((field) => field?.trim() === "")
    // ) {
    //    return res.status(400).json({ message: "All Field are Required!" })
    // }

    const id = req.body.id;
    const updatedStudent = await User.findByIdAndUpdate(
      id,
      { $set: data, "Documents.marksheet12th": marksheet12th },
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json("Something Went Wrong!");
    console.log(err);
  }
});


// router.post("/api/", async (req, res) => {
//   const {
//     courseName,
//     courseType,
//     courseBranch,
//     eligibility,
//     domicile,
//     gender,
//     lastExamType,
//     qualification,
//     category,
//     qualificationPercentage,
//     nationality,
//     passingYear,
//     qualifyingEntranceExam,
//     entranceBasedTypeExam,
//     admissionSession,
//     QualifiedCourse,
//   } = req.body;
//   try {
//     const data = {
//       courseName,
//       courseType,
//       courseBranch,
//       eligibility,
//       domicile,
//       gender,
//       lastExamType,
//       qualification,
//       category,
//       qualificationPercentage,
//       isRegistered: true,
//       passingYear,
//       nationality,
//       admissionSession,
//       QualifiedCourse,
//     };

//     const id = req.body.id;
//     const updatedStudent = await User.findByIdAndUpdate(
//       id,
//       { $set: data },
//       { new: true }
//     );
//     res.status(200).json(updatedStudent);
//   } catch (err) {
//     res.status(500).json("Something Went Wrong!");
//     console.log(err);
//   }
// });

/////////////////ENROLLMENT DATA ///////////////////////////////////



router.put("/api/updatestudent", async (req, res) => {
  try {
    const {
      fileUrls,
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
    const errors = [];

    const validateNumber = (field, fieldName, length) => {
      const fieldValue = professionalFormData[field].toString();
      if (
        fieldValue !== "nill" &&
        (!/^\d+$/.test(fieldValue) || fieldValue.length !== length)
      ) {
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
      const requiredFields = fields.filter((field) => !fileUrls[field]);
      if (requiredFields.length > 0) {
        errors.push(`Please provide URLs for the following required fields`);
      }
    };

    const requiredFileFields = [
      "applicantPhoto",
      "applicantSignature",
      "aadharCard",
      "marksheet10th",
      "marksheet12th",
      "domicileCertificate",
      "transferCertificate",
      "incomeCertificate",
      "migrationCertificate",
    ];

    validateFileUrls(fileUrls, requiredFileFields);
    validateNotBlank("Handicapped", "Handicapped", professionalFormData);
    validateNotBlank("Medium", "Medium", professionalFormData);
    validateNotBlank("Nationality", "Nationality", professionalFormData);
    "Domicile", "Domicile", professionalFormData;
    // validateNotBlank('ScholarshipRequired', 'ScholarshipRequired', professionalFormData);
    validateNotBlank(
      "FathersOccupation",
      "FathersOccupation",
      professionalFormData
    );
    validateNotBlank(
      "MothersOccupation",
      "MothersOccupation",
      professionalFormData
    );
    validateNotBlank("address1", "Address Line 1", addressFormData);
    validateNotBlank("country", "country", addressFormData);
    validateNotBlank("state", "state", addressFormData);
    validateNotBlank("district", "district", addressFormData);
    validateNotBlank("pinCode", "pinCode", addressFormData);

    // validateNumber('SamagraId', 'SamagraId', 9);
    validateNumber("AadharNumber", "AadharNumber", 12);

    validateNumber("ParentMobile", "ParentMobile", 10);

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
          isEnrolled: true,
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



function generateapplication(length) {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  const randomNumber = Math.floor(
    Math.pow(10, length - 2) +
      Math.random() * (Math.pow(10, length - 1) - Math.pow(10, length - 2) - 1)
  );

  const random = currentYear + randomNumber.toString();
  return parseInt(random);
}

async function sendId(applicationNumber, email, name) {
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
    subject: "Applied Successfully for Entrance Exam",
    html: `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
           <h2 style="color: #0077b6;">Hello ${name},</h2>
           <p>Your Application for  Entrance  Exam has been Recieved </p>
           <p>Your Application Number is <strong>${applicationNumber}</strong></p>
           <p>Please Pay the Entrance Examination Fee to get the Admit Card <br>
             Thanks for Applying .
           </p>
   
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






router.post("/api/v2/entrancedetails", async (req, res) => {
  const applicationNumber = generateapplication(9);
  const {
    name,
    email,
    address,
    dob,
    fathersname,
    mothersname,
    mobile,
    courseName,
    courseType,
    courseBranch,
    domicile,
    gender,
    qualification,
    category,
    academicFormData,
    fileUrls,
  } = req.body;

 // console.log(academicFormData, "dfd");
  try {
    const userData = {
      applicationNumber,
      name,
      email,
      address,
      dob,
      fathersname,
      mothersname,
      mobile,
      courseName,
      courseType,
      courseBranch,
      domicile,
      gender,
      category,
      isSubmitted: true,
    };

    //console.log(userData , "dfdfsd/apshabd")
    const user = new Entrace(userData);
    user.academicDetails = academicFormData;
    user.Documents = fileUrls;
    // user.Documents.applicantSignature = fileUrls.applicantSignature;
    const UserData = await user.save();

    sendId(applicationNumber, email, name);
    //  const updatedStudent = await User.f(id, { $set: {data,  academicDetails:academicFormData } }, { new: true })
    res.status(200).json(UserData);
  } catch (err){
    res.status(500).json("Something Went Wrong!");
    console.log(err);
  }
});







function generateRandomNumberid2(length) {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  const randomNumber = Math.floor(
    Math.pow(10, length - 2) +
      Math.random() * (Math.pow(10, length - 1) - Math.pow(10, length - 2))
  );

  const random = currentYear + randomNumber.toString();
  return parseInt(random);
}



router.post("/api/v2/e-pravesh/register", limiter,async (req, res) => {
  const randomId = generateRandomNumberid2(9); // Generates a random UUID
  const randomPassword = generateRandomNumberid2(8);
  const {
    email,
    name,
    dob,
    mothersname,
    fathersname,
    mobile,
    gender,
    lastExamType,
    qualification,
    lastPercentage,
    category,
    nationality,
    AbcId,
    domicile,
    passingYear,
    courseBranch,
    courseName,
    courseType,
    lastPassedSubject,
    ObtainedMarks,
  } = req.body;


  try {
    if (mobile && mobile.length !== 10) {
      return res
        .status(401)
        .json({ status: 401, error: "Mobile number must be 10 digits" });
    } else if (email) {
        // const isRegistered = await User.find({email});
        // if(isRegistered){
        //  return res.status(401).json({message:" Email is Already Used " , status:401 })
        // }
    }
    const savedUser = new User({
      email,
      name,
      dob,
      fathersname,
      mothersname,
      gender,
      qualification,
      category,
      nationality,
      AbcId,
      domicile,
      passingYear,
      ObtainedMarks,
      lastPercentage,
      courseName,
      courseBranch,
      courseType,
      lastPassedSubject,
      // LastPercentage,

      lastExamType,
      mobile,
      randomId,
      randomPassword,
      isApproved: false,
      isEnrolled: false,
      StudentType: "EPravesh",
    });
    if (mobile && mobile.length !== 10) {
      res
        .status(401)
        .json({ status: 400, error: "Mobile number must be 10 digits" });
    }

    await savedUser.save();
    sendIdPass(randomId, randomPassword, email, name);
    res
      .status(200)
      .json({
        status: 200,
        message: "Registered Successfully",
        User: savedUser,
      });
  } catch (err) {
    res.status(500).json(err);
  }
});






router.get('/apitest/fee/search', limiter, async (req, res) => {
  try {
    const { admissionSession, courseName } = req.query;

    // Generate a unique cache key based on the admission session and course name
    const cacheKey = `fee_search_${admissionSession}_${courseName}`;

    // Check if data exists in cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Data retrieved from cache");
      return res.status(200).json(cachedData);
    }

    const feeInfo = await Fees.findOne({
      admissionSession,
      courseName,
    });

    if (feeInfo) {
      const { enrollmentFee, registrationFee } = feeInfo;
      // Store data in cache with a TTL of 60 seconds (adjust as needed)
      cache.set(cacheKey, { enrollmentFee, registrationFee }, 60);
      
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

module.exports = router;
