const express = require("express");
const router = express.Router();
const Course = require("../Modal/NewCourse");
const Course2 = require("../Modal/SessionCourse");
const Fees2 = require("../Modal/Fees2");
const Fees3 = require("../Modal/Fees3");
// const passport = require('passport')
const axios = require("axios");
const uploadOnCloudinary = require("../utilities/cloudinary.js");


// const authenticateJWT = passport.authenticate('jwt', { session: false });
router.post("/entrycourse", async (req, res) => {
  try {
    const newCourse = new Course({
      courseType: "Diploma",
      courseNames: [
        {
          courseName: "DIPLOMA PHARMACY ",
          branches: [
            {
              branchName: "PHARMACY",
              eligibility: "10+2 (PCM/PCB) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA BLOOD TRANSFUSION",
          branches: [
            {
              branchName: "BLOOD TRANSFUSION",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA DIALYSIS TECHNICIAN",
          branches: [
            {
              branchName: "DIALYSIS TECHNICIAN",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA PHARMACY (AYURVED)",
          branches: [
            {
              branchName: "AYURVED",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA HUMAN NUTRITION",
          branches: [
            {
              branchName: "HUMAN NUTRITION",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA MEDICAL LAB AND TECHNICIAN",
          branches: [
            {
              branchName: "MEDICAL LAB TECHNICIAN",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA X-RAY RADIOGRAPHER TECHNICIAN",
          branches: [
            {
              branchName: "X-RAY RADIOGRAPHER TECHNICIAN",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA YOGA",
          branches: [
            {
              branchName: "YOGA",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA ENGINEERING",
          branches: [
            {
              branchName: "CHEMICAL ENGINEERING",
              eligibility: "10th Or Equivalent Examination Passed",
              eligibilityGradPer: {
                gen: 0,
                obc: 0,
                sc: 0,
                st: 0,
                ph: 0,
              },
            },
            {
              branchName: "CIVIL ENGINEERING",
              eligibility: "10th Or Equivalent Examination Passed",
              eligibilityGradPer: {
                gen: 0,
                obc: 0,
                sc: 0,
                st: 0,
                ph: 0,
              },
            },
            {
              branchName: "COMPUTER SCIENCE AND ENGINEERING",
              eligibility: "10th Or Equivalent Examination Passed",
              eligibilityGradPer: {
                gen: 0,
                obc: 0,
                sc: 0,
                st: 0,
                ph: 0,
              },
            },
            {
              branchName: "MECHANICAL ENGINEERING",
              eligibility: "10th Or Equivalent Examination Passed",
              eligibilityGradPer: {
                gen: 0,
                obc: 0,
                sc: 0,
                st: 0,
                ph: 0,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA PHARMACY (HOMEOPATHY)",
          branches: [
            {
              branchName: "HOMEOPATHIC",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA PARAMEDICAL OPTHALMIC ASSISTENT",
          branches: [
            {
              branchName: "OPTHALMIC",
              eligibility: "10+2 (PCB) With 50% (UR), 45% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "DIPLOMA ENGINEERING  (Lateral)",
          branches: [
            {
              branchName: "CHEMICAL ENGINEERING",
              eligibility: "10+2 (PCM)",
              eligibilityGradPer: {
                gen: 0,
                obc: 0,
                sc: 0,
                st: 0,
                ph: 0,
              },
            },
            {
              branchName: "CIVIL ENGINEERING",
              eligibility: "10+2 (PCM)",
              eligibilityGradPer: {
                gen: 0,
                obc: 0,
                sc: 0,
                st: 0,
                ph: 0,
              },
            },
            {
              branchName: "COMPUTER SCIENCE AND ENGINEERING",
              eligibility: "10+2 (PCM)",
              eligibilityGradPer: {
                gen: 0,
                obc: 0,
                sc: 0,
                st: 0,
                ph: 0,
              },
            },
            {
              branchName: "MECHANICAL ENGINEERING",
              eligibility: "10+2 (PCM)",
              eligibilityGradPer: {
                gen: 0,
                obc: 0,
                sc: 0,
                st: 0,
                ph: 0,
              },
            },
          ],
        },
      ],
    });

    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/entrycourse2", async (req, res) => {
  try {
    const newCourse = new Course2({
      admissionSession: "2024",
      courseType: "UG",
      courseNames: [
        {
          courseName: "BACHELOR OF PHARMACY",
          branches: [
            {
              branchName: "BACHELOR OF PHARMACY",
            },
            // {
            //   branchName: 'CHEMICAL ENGINEERING',

            // },
            // {
            //   branchName: 'CIVIL ENGINEERING',

            // },
            // {
            //   branchName: 'COMPUTER SCIENCE AND ENGINEERING',

            // },
            // {
            //   branchName: 'ELECTRICAL AND ELECTRONICS ENGINEERING',

            // },
            // {
            //   branchName: 'ELECTRICAL ENGINEERING',

            // },
            // {
            //   branchName: 'ELECTRONICS AND INSTRUMENTATION ENGINEERING',

            // },
            // {
            //   branchName: 'MECHANICAL ENGINEERING',

            // },
            // {
            //   branchName: 'MINING ENGINEERING',

            // },
          ],
        },
      ],
    });

    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/api/v2/update/courses/:id", async (req, res) => {
  const courseId = req.params.id;
  //const updateData = req.body;
  //console.log(updateData);
  try {
    const updateData = {
      courseNames: [
        {
          courseName: "BACHELOR OF DESIGN",
          branches: [
            {
              branchName: "INDUSTRIAL DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "COMMUNICATION DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "TEXTILE DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "TEXTILE DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "INTERIOR DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "PRODUCT DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },
          ],
        },

        {
          courseName: "BACHELOR OF DESIGN(Lateral)",
          branches: [
            {
              branchName: "INDUSTRIAL DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "COMMUNICATION DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "TEXTILE DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "TEXTILE DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "INTERIOR DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "PRODUCT DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },
          ],
        },

        {
          courseName: "BACHELOR OF ENGINEERING(Lateral)",
          branches: [
            {
              branchName: "AERONAUTICAL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "CHEMICAL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "CIVIL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "COMPUTER SCIENCE AND ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "ELECTRICAL AND ELECTRONICS ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "ELECTRICAL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },
            {
              branchName: "ELECTRONICS AND COMMUNICATION ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "MECHANICAL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "MINING ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },
          ],
        },

        {
          courseName: "BACHELOR OF ENGINEERING",
          branches: [
            {
              branchName: "AERONAUTICAL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "CHEMICAL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "CIVIL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "COMPUTER SCIENCE AND ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "ELECTRICAL AND ELECTRONICS ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "ELECTRICAL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },
            {
              branchName: "ELECTRONICS AND COMMUNICATION ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "MECHANICAL ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },

            {
              branchName: "MINING ENGINEERING",
              eligibility: "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },
          ],
        },






        {
          courseName: "BACHELOR OF PHARMACY",
          branches: [
            {
              branchName: "PHARMACY",
              eligibility: "10+2 (PCM/PCB) With 45% (UR) , 40%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 45,
              },
            },
          ],
        },

        {
          courseName: "BACHELOR OF EDUCATION",
          branches: [
            {
              branchName: "BACHELOR OF EDUCATION",
              eligibility:
                "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC) ",
              eligibilityGradPer: {
                gen: 50,
                obc: 50,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },

        {
          courseName: "BSC(Nursing) SEMESTER",
          branches: [
            {
              branchName: "Nursing",
              eligibility: "10+2 (PCB) With 50% (UR/OBC) , 45%(ST/SC) ",
              eligibilityGradPer: {
                gen: 50,
                obc: 50,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },
        {
          courseName: "BACHELOR OF HOTEL MANAGEMENT AND CATERING",
          branches: [
            {
              branchName: "HOTEL MANAGEMENT AND CATERING",
              eligibility:
                "10+2 or Its Equivalent With 45% (UR) , 40%(ST/SC/OBC) ",
              eligibilityGradPer: {
                gen: 45,
                obc: 40,
                sc: 40,
                st: 40,
                ph: 40,
              },
            },
          ],
        },
        {
          courseName: "BACHELOR OF PHYSICAL EDUCATION(B. P. Ed.)",
          branches: [
            {
              branchName: "BACHELOR OF PHYSICAL EDUCATION",
              eligibility:
                "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 50,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },

        {
          courseName: "BACHELOR OF ARTS BACHELOR OF EDUCATION (B. A. B. Ed.)",
          branches: [
            {
              branchName: "BACHELOR OF ARTS BACHELOR OF EDUCATION",
              eligibility:
                "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 50,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },

        {
          courseName: "BACHELOR OF COMMERCE",
          branches: [
            {
              branchName: "COMPUTER APPLICATION",
              eligibility: "10+2 (PCM/PCB/Comm.) With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
            {
              branchName: "PLAIN",
              eligibility: "10+2 (PCM/PCB/Comm.) With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
          ],
        },



        {
          courseName: "BACHELOR OF COMPUTER APPLICATION",
          branches: [
            {
              branchName: "COMPUTER APPLICATION",
              eligibility:
                "10+2 (PCM) or Its Equivalent With 50% (UR/OBC) ,45 %(ST/SC)",
              eligibilityGradPer: {
                gen: 50,
                obc: 45,
                sc: 45,
                st: 45,
                ph: 45,
              },
            },
          ],
        },

        {
          courseName: "BACHELOR OF ARCHITECTURE",
          branches: [
            {
              branchName: "ARCHITECTURE",
              eligibility:
                "10+2 (PCM)  With 50% In Each Subject (UR/OBC/ST/SC) ",
              eligibilityGradPer: {
                gen: 50,
                obc: 50,
                sc: 50,
                st: 50,
                ph: 50,
              },
            },
          ],
        },

        {
          courseName: "BACHELOR OF ARTS",
          branches: [
            {
              branchName: "COMPUTER APPLICATION",
              eligibility: "10+2 Or Its Equivalent With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
            {
              branchName: "PLAIN",
              eligibility: "10+2 (PCM/PCB/Comm.) With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
          ],
        },
        {
          courseName: "BACHELOR OF SCIENCE",
          branches: [
            {
              branchName: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
              eligibility: "10+2 Or Its Equivalent With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
            {
              branchName: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
              eligibility: "10+2 (PCM/PCB/Comm.) With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
            {
              branchName: "BACHELOR OF SCIENCE IN BIOLOGY",
              eligibility: "10+2 (PCM/PCB/Comm.) With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
            {
              branchName: "BACHELOR OF SCIENCE IN MATHEMATICS",
              eligibility: "10+2 (PCM/PCB/Comm.) With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
            {
              branchName: "BACHELOR OF SCIENCE IN MICROBIOLOGY",
              eligibility: "10+2 (PCM/PCB/Comm.) With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
            {
              branchName: "BACHELOR OF SCIENCE IN BIOCHEMISTRY",
              eligibility: "10+2 (PCM/PCB/Comm.) With 40% (UR) ,33%(ST/SC/OBC)",
              eligibilityGradPer: {
                gen: 40,
                obc: 33,
                sc: 33,
                st: 33,
                ph: 33,
              },
            },
          ],
        },


      ],
    };
    // Find the course by ID and update it
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(updatedCourse); // Send the updated course as response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/api/v2/update/courses2/:id", async (req, res) => {
  const courseId = req.params.id;
  //const updateData = req.body;
  //console.log(updateData);
  try {
    const updateData = {
      courseNames: [
        {
          courseName: "BACHELOR OF DESIGN",
          branches: [
            {
              branchName: "INDUSTRIAL DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "COMMUNICATION DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "TEXTILE DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              enabled: true,
            },

            // {
            //   branchName: "TEXTILE DESIGN",
            //   eligibility:
            //     "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
            //   enabled: true,
            // },

            {
              branchName: "INTERIOR DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "PRODUCT DESIGN",
              eligibility:
                "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
              enabled: true,
            },
          ],
        },

        {
          courseName: "BACHELOR OF ENGINEERING",
          branches: [
            {
              branchName: "AERONAUTICAL ENGINEERING",

              enabled: true,
            },

            {
              branchName: "CHEMICAL ENGINEERING",

              enabled: true,
            },

            {
              branchName: "CIVIL ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "COMPUTER SCIENCE AND ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "ELECTRICAL AND ELECTRONICS ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "ELECTRICAL ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },
            {
              branchName: "ELECTRONICS AND COMMUNICATION ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "MECHANICAL ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "MINING ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },
          ],
        },
        {
          courseName: "BACHELOR OF PHARMACY",
          branches: [
            {
              branchName: "PHARMACY",
              // eligibility:
              //   "10+2 (PCM/PCB) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },
          ],
        },

        {
          courseName: "BACHELOR OF EDUCATION",
          branches: [
            {
              branchName: "BACHELOR OF EDUCATION",
              // eligibility:
              //   "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC) ",
              enabled: true,
            },
          ],
        },

        {
          courseName: "BSC(Nursing) SEMESTER",
          branches: [
            {
              branchName: "Nursing",
              // eligibility:
              //   "10+2 (PCB) With 50% (UR/OBC) , 45%(ST/SC) ",
              enabled: true,
            },
          ],
        },
        {
          courseName: "BACHELOR OF HOTEL MANAGEMENT AND CATERING",
          branches: [
            {
              branchName: "HOTEL MANAGEMENT AND CATERING",
              // eligibility:
              //   "10+2 or Its Equivalent With 45% (UR) , 40%(ST/SC/OBC) ",
              enabled: true,
            },
          ],
        },
        {
          courseName: "BACHELOR OF PHYSICAL EDUCATION(B. P. Ed.)",
          branches: [
            {
              branchName: "BACHELOR OF PHYSICAL EDUCATION",
              // eligibility:
              //   "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC)",
              enabled: true,
            },
          ],
        },

        {
          courseName:
            "BACHELOR OF ARTS BACHELOR OF EDUCATION (B. A. B. Ed.)    ",
          branches: [
            {
              branchName: "BACHELOR OF ARTS BACHELOR OF EDUCATION",
              // eligibility:
              //   "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC)",
              enabled: true,
            },
          ],
        },

        {
          courseName: "BACHELOR OF ARCHITECTURE",
          branches: [
            {
              branchName: "ARCHITECTURE",
              enabled: true,
            },
          ],
        },

        {
          courseName: "BACHELOR OF SCIENCE",
          branches: [
            {
              branchName: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
              enabled: true,
            },
            {
              branchName: "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY",
              enabled: true,
            },
            {
              branchName: "BACHELOR OF SCIENCE IN BIOLOGY",
              enabled: true,
            },
            {
              branchName: "BACHELOR OF SCIENCE IN MATHEMATICS",
              enabled: true,
            },
            {
              branchName: "BACHELOR OF SCIENCE IN MICROBIOLOGY",
              enabled: true,
            },
            {
              branchName: "BACHELOR OF SCIENCE IN BIOCHEMISTRY",
              enabled: true,
            },
          ],
        },
        {
          courseName: "BACHELOR OF BUSINESS ADMINISTRATION",
          branches: [
            {
              branchName: "MANAGEMENT",
              enabled: true,
            },
          ],
        },

        {
          courseName: "BACHELOR OF ARTS",
          branches: [
            {
              branchName: "COMPUTER APPLICATION",
              enabled: true,
            },
            {
              branchName: "PLAIN",
              enabled: true,
            },
          ],
        },
        {
          courseName: "BACHELOR OF DESING(Lateral)",
          branches: [
            {
              branchName: "INTERIOR DESIGN",
              enabled: true,
            },
          ],
        },
        {
          courseName: "BACHELOR OF COMMERCE",
          branches: [
            {
              branchName: "COMPUTER APPLICATION",
              enabled: true,
            },
            {
              branchName: "PLAIN",
              enabled: true,
            },
          ],
        },

        {
          courseName: "BACHELOR OF COMPUTER APPLICATION",
          branches: [
            {
              branchName: "COMPUTER APPLICATION",
              enabled: true,
            },
          ],
        },

        {
          courseName: "BACHELOR OF ENGINEERING(Lateral)",
          branches: [
            {
              branchName: "AERONAUTICAL ENGINEERING",

              enabled: true,
            },

            {
              branchName: "CHEMICAL ENGINEERING",

              enabled: true,
            },

            {
              branchName: "CIVIL ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "COMPUTER SCIENCE AND ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "ELECTRICAL AND ELECTRONICS ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "ELECTRICAL ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },
            {
              branchName: "ELECTRONICS AND COMMUNICATION ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "MECHANICAL ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },

            {
              branchName: "MINING ENGINEERING",
              // eligibility:
              //   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
              enabled: true,
            },
          ],
        },
      ],
    };
    // Find the course by ID and update it
    const updatedCourse = await Course2.findByIdAndUpdate(
      courseId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(updatedCourse); // Send the updated course as response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.put("/api/v2/update/courses2/:id", async (req, res) => {
//   const courseId = req.params.id;

//   try {
//     const updateData = {

//       courseNames: [
//         {
//             courseName: "BACHELOR OF DESIGN",
//             branches: [
//               {
//                 branchName: "INDUSTRIAL DESIGN",
//                 eligibility:
//                   "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "COMMUNICATION DESIGN",
//                 eligibility:
//                   "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "TEXTILE DESIGN",
//                 eligibility:
//                   "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "TEXTILE DESIGN",
//                 eligibility:
//                   "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "INTERIOR DESIGN",
//                 eligibility:
//                   "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "PRODUCT DESIGN",
//                 eligibility:
//                   "10+2 (Any Discipline) With 45% (UR), 40% (ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },
//             ],
//           },

//           {
//             courseName: "BACHELOR OF ENGINEERING",
//             branches: [
//               {
//                 branchName: "AERONAUTICAL ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "CHEMICAL ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "CIVIL ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "COMPUTER SCIENCE AND ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "ELECTRICAL AND ELECTRONICS ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "ELECTRICAL ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },
//               {
//                 branchName: "ELECTRONICS AND COMMUNICATION ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "MECHANICAL ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//               {
//                 branchName: "MINING ENGINEERING",
//                 eligibility:
//                   "10+2 (PCM) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },
//             ],
//           },
//          {
//             courseName: "BACHELOR OF PHARMACY",
//             branches: [
//               {
//                 branchName: "PHARMACY",
//                 eligibility:
//                   "10+2 (PCM/PCB) With 45% (UR) , 40%(ST/SC/OBC)",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 45,
//                 },
//               },

//             ],
//           },

//         {
//             courseName: "BACHELOR OF EDUCATION",
//             branches: [
//               {
//                 branchName: "BACHELOR OF EDUCATION",
//                 eligibility:
//                   "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC) ",
//                 eligibilityGradPer: {
//                   gen: 50,
//                   obc: 50,
//                   sc: 45,
//                   st: 45,
//                   ph: 45,
//                 },
//               },

//             ],
//           },

//           {
//             courseName: "BSC(Nursing) SEMESTER",
//             branches: [
//               {
//                 branchName: "Nursing",
//                 eligibility:
//                   "10+2 (PCB) With 50% (UR/OBC) , 45%(ST/SC) ",
//                 eligibilityGradPer: {
//                   gen: 50,
//                   obc: 50,
//                   sc: 45,
//                   st: 45,
//                   ph: 45,
//                 },
//               },

//             ],
//           },
//           {
//             courseName: "BACHELOR OF HOTEL MANAGEMENT AND CATERING",
//             branches: [
//               {
//                 branchName: "HOTEL MANAGEMENT AND CATERING",
//                 eligibility:
//                   "10+2 or Its Equivalent With 45% (UR) , 40%(ST/SC/OBC) ",
//                 eligibilityGradPer: {
//                   gen: 45,
//                   obc: 40,
//                   sc: 40,
//                   st: 40,
//                   ph: 40,
//                 },
//               },

//             ],
//           },
//            {
//             courseName: "BACHELOR OF PHYSICAL EDUCATION(B. P. Ed.)",
//             branches: [
//               {
//                 branchName: "BACHELOR OF PHYSICAL EDUCATION",
//                 eligibility:
//                   "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC)",
//                 eligibilityGradPer: {
//                   gen: 50,
//                   obc: 50,
//                   sc: 45,
//                   st: 45,
//                   ph: 45,
//                 },
//               },

//             ],
//           },

//          {
//             courseName: "BACHELOR OF ARTS BACHELOR OF EDUCATION (B. A. B. Ed.)    ",
//             branches: [
//               {
//                 branchName: "BACHELOR OF ARTS BACHELOR OF EDUCATION",
//                 eligibility:
//                   "Graduate in Any Discipline With 50% (UR/OBC) , 45%(ST/SC)",
//                 eligibilityGradPer: {
//                   gen: 50,
//                   obc: 50,
//                   sc: 45,
//                   st: 45,
//                   ph: 45,
//                 },
//               },

//             ],
//           },

//        {
//             courseName: "BSC(Nursing) SEMESTER",
//             branches: [
//               {
//                 branchName: "Nursing",
//                 eligibility:
//                   "10+2 (PCB) With 50% (UR/OBC) , 45%(ST/SC) ",
//                 eligibilityGradPer: {
//                   gen: 50,
//                   obc: 50,
//                   sc: 45,
//                   st: 45,
//                   ph: 45,
//                 },
//               },

//             ],
//           },

//         ],

//     // Iterate through each update object and update the course
//     for (const updateObj of updateData) {
//       await Course.updateOne({ _id: courseId, 'courseNames.courseName': updateObj.courseName }, { $set: { 'courseNames.$': updateObj } });
//     }

//     const updatedCourses = await Course.findById(courseId);

//     res.json(updatedCourses); // Send the updated courses as response
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// router.post('/api/v2/entrycourse3', async (req, res) => {
//   try {
//     const { admissionSession, courseType, courseName, branchName } = req.body;

//     // Check if a document with the specified admission session already exists
//     let existingCourse = await Course2.findOne({ 'courseType': courseType, 'courseNames.courseName': courseName, 'admissionSession': admissionSession });

//     if (existingCourse) {
//       // If admission session exists, update the existing document by adding the new branch
//       const existingCourseName = existingCourse.courseNames.find(course => course.courseName === courseName);
//       if (existingCourseName) {
//         existingCourseName.branches.push({ branchName });
//         const updatedCourse = await existingCourse.save();
//         return res.status(200).json(updatedCourse);
//       } else {
//         return res.status(404).json({ error: 'Course not found' });
//       }
//     } else {
//       // If admission session doesn't exist, create a new document for the new session
//       const newCourse = new Course2({
//         admissionSession,
//         courseType,
//         courseNames: [{ courseName, branches: [{ branchName }] }]
//       });
//       const savedCourse = await newCourse.save();
//       return res.status(201).json(savedCourse);
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.post('/api/v2/entrycourse3', async (req, res) => {
//   try {
//     const { admissionSession, courseType, courseName, branchName } = req.body;

//     // Check if a document with the specified admission session already exists
//     let existingCourse = await Course2.findOne({ 'courseType': courseType, 'courseNames.courseName': courseName, 'admissionSession': admissionSession });

//     if (existingCourse) {
//       // If admission session exists, update the existing document by adding the new branch
//       const existingCourseName = existingCourse.courseNames.find(course => course.courseName === courseName);
//       if (existingCourseName) {
//         existingCourseName.branches.push({ branchName });
//         const updatedCourse = await existingCourse.save();
//         return res.status(200).json(updatedCourse);
//       } else {
//         return res.status(404).json({ error: 'Course not found' });
//       }
//     } else {
//       // If admission session doesn't exist, create a new document for the new session
//       const newCourse = new Course2({
//         admissionSession,
//         courseType,
//         courseNames: [{ courseName, branches: [{ branchName }] }]
//       });
//       const savedCourse = await newCourse.save();
//       return res.status(201).json(savedCourse);
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.post("/api/v2/entrycourse3", async (req, res) => {
  try {
    const { admissionSession, courseType, courseName, branchName } = req.body;

    let existingCourse = await Course2.findOne({
      courseType: courseType,
      admissionSession: admissionSession,
    });
    console.log(existingCourse.courseNames.branches);
    if (existingCourse) {
      console.log("ye chal ra hai if ");
      if (existingCourse.admissionSession === admissionSession) {
        const existingCourseName = existingCourse.courseNames.find(
          (course) => course.courseName === courseName
        );
        if (existingCourseName) {
          existingCourseName.branches.push({ branchName });
          const updatedCourse = await existingCourse.save();
          return res.status(200).json(updatedCourse);
        } else {
          console.log("ye chal raha hai ");
          existingCourse.courseNames.push({
            courseName,
            branches: [{ branchName }],
          });
          const updatedCourse = await existingCourse.save();
          return res.status(200).json(updatedCourse);
        }
      }
    } else {
      console.log("ye else hai ");
      const newCourse = new Course2({
        admissionSession,
        courseType,
        courseNames: [{ courseName, branches: [{ branchName }] }],
      });
      const savedCourse = await newCourse.save();
      return res.status(201).json(savedCourse);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/geteligibility", async (req, res) => {
  const { courseType, courseName, courseBranch } = req.body;
  console.log(courseType, courseName, courseBranch);
  try {
    const course = await Course.findOne({
      courseType: courseType,
      "courseNames.courseName": courseName,
      "courseNames.branches.branchName": courseBranch,
    });

    if (course) {
      const { branches } = course.courseNames.find(
        (item) => item.courseName === courseName
      );

      const branch = branches.find((item) => item.branchName === courseBranch);

      if (branch) {
        const { eligibility, eligibilityGradPer } = branch;
        return res.status(200).json({ eligibility, eligibilityGradPer });
      }
    }

    return res.status(404).json({ error: "Course not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get('/send-sms', async (req, res) => {
//   // Extract query parameters
//   const apiKey = 'pYJBnhQN2EtXLRWFf39ZxvdHSwCTlkoP45e17yagIsKGDcMUrmRfQkzU6Z5rPsxJieKgHIbcB1MLuldT'
//   const message = "Hello From AL3x , This is your otp : 1234";
//   const language = "english";
//   const route = "q";
//   const numbers = "6263382707";

//   // Make sure to perform validation and error handling here

//   try {
//     const smsRes = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
//       params: {
//         authorization: apiKey,
//         message: message,
//         language: language,
//         route: route,
//         numbers: numbers,
//       },
//       headers: {
//         'cache-control': 'no-cache',
//       },
//     });

//     res.json(smsRes.data);
//     console.log("sms sent successfully")
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.post("/api/randomfile", async (req, res) => {
  try {
    // const filename = req.file.filename;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // console.log(req.files?.formData[0]?.path)
    // const avatarLocalPath = req.files?.file[0]?.path;
    // const avatar = await uploadOnCloudinary(avatarLocalPath)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/apitest/admin/EPraveshFee2", async (req, res) => {
  try {
    const sessionYear = req.query.sessionYear;
    const courseName = req.query.courseName;
    //const courseName = req.query.courseName;

    console.log(sessionYear, courseName, "data from Frontend");
    const fees = await Fees2.findOne({
      "sessions.sessionYear": sessionYear,
      "sessions.courseNames.courseName": courseName,
      "sessions.courseNames.courseName.branches.": courseName,
    });

    if (!fees) {
      return res
        .status(404)
        .json({
          error:
            "Fees not found for the specified session year and course name",
        });
    }

    const session = fees.sessions[0];
    const course = session.courseNames.find(
      (course) => course.courseName === courseName
    );

    if (!course) {
      return res
        .status(404)
        .json({ error: "Course not found for the specified course name" });
    }

    res.status(200).json({ registrationFee: course.registrationFee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/apitest/admin/EntranceFee2", async (req, res) => {
  try {
    const sessionYear = req.query.sessionYear;
    const courseName = req.query.courseName;

    console.log(sessionYear, courseName, "data from Frontend");
    const fees = await Fees2.findOne({
      "sessions.sessionYear": sessionYear,
      "sessions.courseNames.courseName": courseName,
    });

    if (!fees) {
      return res
        .status(404)
        .json({
          error:
            "Fees not found for the specified session year and course name",
        });
    }

    const session = fees.sessions[0];
    const course = session.courseNames.find(
      (course) => course.courseName === courseName
    );

    if (!course) {
      return res
        .status(404)
        .json({ error: "Course not found for the specified course name" });
    }

    res.status(200).json({ registrationFee: course.registrationFee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/apitest/admin/epravesh-fee", async (req, res) => {
  
//   try {
//     const { courseName, branchName, sessionYear } = req.query;
//     console.log(courseName, branchName , sessionYear , "Data from frontend or postman")
//     let query = {};

//     if (courseName) {
//       query["sessions.courses.courseName"] = courseName;
//     }

//     if (branchName) {
//       query["sessions.courses.branches.branchName"] = branchName;
//     }

//     if (sessionYear) {
//       query["sessions.sessionYear"] = sessionYear;
//     }

//     const fees = await Fees3.find(query);
//     console.log("Queried Fees " , fees)





//     // const session = fees.sessions[0];
//     // const course = session.courseNames.find(
//     //   (course) => course.courseName === courseName
//     // );

    
//     res.status(200).json(fees);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/apitest/admin/epravesh-fee", async (req, res) => {
  try {
    const { courseName, branchName, sessionYear } = req.query;
//    console.log(courseName, branchName, sessionYear, "Data from frontend or postman");

    let query = {};

    if (courseName) {
      query["sessions.courses.courseName"] = courseName;
    }
   
    if (branchName) {
      query["sessions.courses.branches.branchName"] = branchName;
    }

    if (sessionYear) {
      query["sessions.sessionYear"] = sessionYear;
    }

//    console.log("Query object:", query); // Log the query object

    const fees = await Fees3.aggregate([
      { $match: query },
      { $unwind: "$sessions" },
      { $unwind: "$sessions.courses" },
      { $unwind: "$sessions.courses.branches" },
      { 
        $match: { 
          "sessions.courses.courseName": courseName,
          "sessions.courses.branches.branchName": branchName
        } 
      },
      { 
        $project: { 
          registrationFee: "$sessions.courses.branches.registrationFee" 
        } 
      }
    ]);

 //   console.log("Queried Fees:", fees);
    res.status(200).json(fees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.send('You have accessed a protected route');
// });




module.exports = router;
