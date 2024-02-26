const mongoose = require('mongoose')
const  Admin = require('../Modal/Admin')




//==================== Admin Login ========================//

const login = async (req,res)=>{
    const { email, password } = req.body
  //console.log(email , password , " data from postman ")
  try {
    const user = await Admin.findOne({ email: email })

    const isPassword = await Admin.findOne({ password: password })
    //console.log(isPassword , "is password ")
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
    
}


const register = async(req,res)=>{
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
}



module.exports = { login, register}