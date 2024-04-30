const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const User = require('../Modal/Student')
const jwt = require('jsonwebtoken')



//------Function To generate random Otp-------

function generateOTP() {
    
    return Math.floor(100000 + Math.random() * 900000).toString();
 }
const SendOtp = async (req,res)=>{
    const { email, otp } = req.body;

    try {
       const emailverified = await User.findOne({ email: email })
       if (emailverified) {
          res.status(400).json('This email is already exists')
       }
       else {
          if (!otp) {
             // G
             const generatedOTP = generateOTP();
             sendEmail(email, `Your OTP: ${generatedOTP}`);
             console.log(generateOTP, "generateotp")
 
             // Store the OTP with its expiration time (e.g., 5 minutes)
             const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
             otpStorage.set(email, { otp: generatedOTP, expirationTime });
 
             res.status(201).json({ status: 201, message: 'OTP sent' });
          } else {
             // Verify the provided OTP
             const isOTPValid = verifyOTP(email, otp);
             console.log(isOTPValid, 'isotpvalid')
 
             if (isOTPValid) {
                console.log('Email sent successfully');
                res.status(200).json({ status: 200, message: 'Email sent successfully' });
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
}



//-------Function to Generate Random ID and Password ---------//

function generateRandomNumberid(length) {
   return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
}


//---------Function to Verify OTP  -------------//

function verifyOTP(email, enteredOTP) {
   const storedOTPData = otpStorage.get(email);

   if (storedOTPData && Date.now() < storedOTPData.expirationTime) {
      return enteredOTP === storedOTPData.otp;
   }
   return false;
}


//------------Controller for OTP Verification -----------//

const VerifyOtp = async(req,res)=>{
   const { email, otp } = req.body;
   console.log(email)
   try {
      const isOTPValid = verifyOTP(email, otp);
      console.log(otp)
      if (isOTPValid) {
         res.status(200).json({status:200,  message: 'OTP verified successfully' });
      } else {
         res.status(401).json({status:401 , message: 'Invalid OTP' });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, error: 'Server error' });
   }
}


//-----------Function to Send Generated Random ID PASSWORD ON Registered user's mail ---------//

async function sendIdPass(randomId , randomPassword , email , name){
   const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD,
      },
   });

   const mailOptions = {
      from:process.env.EMAIL,
      to: email,
      subject: "Registration Successfull",
      text: `Hello ${name} , Your Registration  has been confirmed with Sri Satya Sai University of Technology and Medical Sciences, Sehore , Your Registration No is ${randomId} and password is <b>${randomPassword}`,
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



//---------------Registration Controller ------------//

const Register = async (req , res)=>{
   const randomId = generateRandomNumberid(9); // Generates a random UUID
   const randomPassword = generateRandomNumberid(8);
   const { email , name , dob , mothersname , fathersname , mobile}   = req.body;
     console.log(email , name , dob , mothersname , fathersname , "data")
   try {
      const savedUser = new User({
         email,
         name ,
         dob,
         fathersname,
         mothersname,
         mobile,
         randomId,
         randomPassword,
         isApproved:false,
         isEnrolled:false
           
      });
   
      savedUser.save();
      sendIdPass(randomId , randomPassword, email , name)
      res.status(200).json('Registered Successfully')
   } catch (err) {
      res.status(500).json(err)
   }
}





//-------- Login Controller ---------------//
const login = async(req,res)=>{
   const { randomId, randomPassword } = req.body;
      try {
         const user = await User.findOne({ randomId: randomId , randomPassword:randomPassword });
         const UserResponse = {
            user:user._id , 
            username:user.name ,
            email:user.email ,
            dob:user.dob ,
            isApproved:user.isApproved,
            isRegistered:user.isRegistered,
            fathersname:user.fathersname,
            mothersname:user.mothersname,
            mobile:user.mobile
               

         }
         if (user) {
           
             const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , { expiresIn: '1h' });
             const option = {
               expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
               secure: true,
               httpOnly: true,
               sameSite: "none",
               //path: "/",
             };
             res.cookie("access-token", token, option).status(200).json({ message: 'Login successful', UserResponse});
         } else {
             res.status(401).json({ message: 'Invalid login credentials' });
         }
     } catch (err) {
         res.status(500).json({ message: 'Something went wrong' });
         console.error(err);
     }
}



module.exports = { SendOtp , VerifyOtp , login , Register }