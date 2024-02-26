const mongoose = require('mongoose');


const AdminSchema = new mongoose.Schema({
 
  email:{
     type:String,
     required:true
  },
  password:{
    type:String,
  },
  isAdmin:{
    type:Boolean,
    default:true
  }
    
},{timestamps:true});


const Admin = mongoose.model('Admin',AdminSchema)

module.exports = Admin;