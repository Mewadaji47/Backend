require('dotenv').config();
const express = require("express");
const app = express();
const router = require("./routes/router")
const router2 = require("./routes/Router2")
const router3 = require("./routes/HODroutes")
const router5 = require('./routes/AdminRoutes')
const router4 = require("./routes/PaymentRoutes")
const cors = require("cors");
const Db = require('./Modal/connection')
const uuid = require('uuid')
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 7786;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const authenticateHOD = require('./middleware/verifyHod')
const morgan = require('morgan')
const logger = require('./utilities/logger');
const passport = require('passport');

//Middlewares 

// app.use(passport.initialize());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,

}));





app.use((req, res, next) => {
  // If you're behind a reverse proxy like nginx or Heroku,
  // you may want to use req.headers['x-forwarded-for'] instead
  req.ip = req.connection.remoteAddress;
  console.log('ip ' , req.ip)
  next();
});













//logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
  stream: {
    write: message => {
      const logObject = {
        ipAddress: message.split(' ')[0],
        message: message.trim() 
      };
   

    }
  }
}));

const logFilePath = path.join(__dirname, 'requests.log');
let dailyRequests = {}; 



app.use((req, res, next) => {
  res.on('header', () => {
    if (res.getHeader('X-RateLimit-Remaining')) {
      const remainingTime = Math.ceil(res.getHeader('X-RateLimit-Reset') - Date.now());
      res.setHeader('X-RateLimit-Time', remainingTime);
    }
  });
  next();
});







// Middleware for request logging and counting
app.use((req, res, next) => {
  const today = new Date().toISOString().split('T')[0]; // Get the current date in "YYYY-MM-DD" format

  // Initialize the counter for the current date if it doesn't exist
  if (!dailyRequests[today]) {
    dailyRequests[today] = {
      count: 0,
      details: [],
    };
  }

  const start = new Date();
  res.on('finish', () => {
    const end = new Date();
    const duration = end - start;

    // Log the request details
    const logMessage = `[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
    dailyRequests[today].count++;
    saveRequestDetails(logMessage);


  });

  next();
});




// Middleware for Prometheus metrics endpoint
app.get('/metrics', (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // Get the current date in "YYYY-MM-DD" format
  const metrics = `backend_daily_requests_total{date="${today}"} ${dailyRequests[today].count || 0}`;
  res.set('Content-Type', 'text/plain');
  res.end(metrics);
});







function saveRequestDetails(details) {
  const today = new Date().toISOString().split('T')[0]; 

  // Append the details to the main log file
  fs.appendFile(logFilePath, details + '\n', (err) => {
    if (err) {
      logger.error(`Error saving request details to file: ${err.message}`);
    }
  });

  // Update the count in the log file
  fs.appendFile(logFilePath, `${today} : count = ${dailyRequests[today].count}\n`, (err) => {
    if (err) {
      logger.error(`Error updating request count to file: ${err.message}`);
    }
  });
}

app.use(cookieParser());
app.use(router);
app.use(router2)
app.use(router3)
app.use(router4)
app.use(router5)


app.get('/',(req,res)=>{
  res.json('working.........')
})


// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
// });

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
})
