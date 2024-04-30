// const jwt = require('jsonwebtoken');

// const authenticate = (req, res, next) => {

//   //const authHeader = req.headers['authorization'];
//  // const token = authHeader && authHeader.split(' ')[1]; // Get token from Authorization header
// //console.log(token)
// const token = req.headers['authorization'];
//   // console.log(req.cookies)
//  console.log('cookie' , token)
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: Missing token' });
//   }

//   try {


//      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err || !decoded.isAdmin) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         req.user = decoded;
//        // console.log(decoded)
//         next();
//     });

//    // console.log(decoded.isAdmin ,"is Admin")
//     if (decoded.isAdmin) {
//       req.userId = decoded.userId;
//       req.isAdmin = decoded.isAdmin;
      
//       next();
//     } else {
//       return res.status(401).json({ message: 'Unauthorized:You cannot access the route' });
//     }
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//   }
// };



// module.exports = authenticate;

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];

  console.log(token, "token")
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
