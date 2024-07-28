const mongoose = require("mongoose")
const colors = require("colors");
const connectDB = async () =>{
   try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connect To MongoDb ${mongoose.connection.host}`.bgCyan.white);
   } catch (error) {
    console.log(`mongobd database error ${error}`.
        bgRed.white
    )
    
   }
};

module.exports = connectDB;