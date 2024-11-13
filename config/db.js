const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
      console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
    } catch (error) {
      console.log(`Mongodb Server Issue ${error}`.bgRed.white);
    }

};
module.exports = connectDB;