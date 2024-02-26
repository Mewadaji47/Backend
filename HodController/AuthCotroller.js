const HOD = require('../Modal/HOD')
const User = require('../Modal/Student')
const jwt = require('jsonwebtoken')
const verifyHod = require('../middleware/verifyHod')






//-----------------------------------Registration Controller ----------------------------------------------------------------------//

const Register = async (req, res) => {
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
}


//---------------------------------------------Login Controller --------------------------------------------------------//
const login = async (req, res) => {
  try {
    const user = await HOD.findOne({ email: req.body.email })

    // const isPassoword = await HOD.findOne({Password:Password})
    if (!user) {
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
      }).status(200).json({ UserResponse });
    }
  } catch (error) {
    console.log(error)
  }
}







//---------------------------------- HOD Controller for Approval of New Registered students ----------------------------------//

const NewRegistrationRequests = async (req, res) => {
  const { Branch } = req.query;

  try {
    //Used Regex for searching in capital format 
    const branchRegex = new RegExp(Branch.split(/\s+/).map(term => `(?=.*${term})`).join(''), 'i');
    console.log(branchRegex)
    const students = await User.find({
      courseBranch: branchRegex,

    });
    const approvedStudents = students.filter(student => student.isApproved === false);
    // console.log(approvedStudents)
    res.status(200).json({ students: approvedStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


// --------------------HOD Controller for getting single Student Detail by using his ID ---------------------------------------------//

const getstudentdetail = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    //console.log(studentId);
    const student = await User.findOne({ _id: studentId });
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
}



// -------------------------- HOD Controller for Checking Enrollment Request -------------------------------------------//
const Enrollments = async (req, res) => {
  const { Branch } = req.body;

  try {

    const branchRegex = new RegExp(Branch.split(/\s+/).map(term => `(?=.*${term})`).join(''), 'i');
    console.log(branchRegex)
    const students = await User.find({
      courseBranch: branchRegex,

    });
    const approvedStudents = students.filter(student => student.isEnrolled === false && student.isApproved === true);
    // console.log(approvedStudents)
    res.status(200).json({ students: approvedStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



//---------------------Controller in Which requested students approved by HOD -------------------------------------------//

const ApproveStudents = async (req, res) => {
  const hodId = req.body.hodId
  const studentId = req.body.studentId;
  //console.log('chale raha ' , hodId , studentId)
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
    await student.save();

    res.json({ message: 'Student approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports = { login, Register, NewRegistrationRequests, ApproveStudents, Enrollments, getstudentdetail }