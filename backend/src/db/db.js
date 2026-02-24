const mongoose = require('mongoose');

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB Atlas connected');
    })
    .catch((err) => {
      console.log('MongoDB connection error:', err);
      process.exit(1); //yeh optional hai agar connection fail ho jata hai toh server ko band kar dena chahiye
    });
}

module.exports = connectDB;

