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
const uuid =  require('uuid')
const port = process.env.PORT || 7786;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authenticateHOD = require('./middleware/verifyHod')
app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors({
     origin: 'http://localhost:3000', 
     credentials: true,

 }));
app.use(cookieParser());
app.use(router);
app.use(router2)
app.use(router3)
app.use(router4)
app.use(router5)

//app.use(authenticateHOD);



app.get("/api", (req, res) => {
    res.send("My Server Created By AL3x ")
 })


// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
// });

app.options('/login', (req, res) => {
   
});


app.listen(port, () => {
    console.log(`server start at port no :${port}`)
})
