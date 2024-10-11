const mongoose = require("mongoose");

//Database Connection
const database = () => {
  mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Db connected")
  }).catch((error)=>{
    console.log(error)
  });
};

module.exports=database
