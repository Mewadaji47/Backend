const mongoose = require('mongoose')

mongoose.connect(process.env.DB,{

}).then(()=>{
    console.log('Info : Connected to Database successfully')
}).catch((err)=>console.log(err))


module.exports = require;

