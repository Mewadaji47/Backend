const jwt = require('jsonwebtoken');

const authenticateHOD = (req, res, next) => {

  //const authHeader = req.headers['authorization'];
 // const token = authHeader && authHeader.split(' ')[1]; // Get token from Authorization header
//console.log(token)
  const token = req.cookies['accessToken']
  console.log('cookie' , token)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    if (decoded.isHod) {
      req.userId = decoded.userId;
      req.isHod = decoded.isHod;
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized: User is not HOD' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticateHOD;
