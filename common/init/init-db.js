const mongoose = require('mongoose');

const config = require('../config/configuration');
/**
 * @function
 * Connecting to Mongo DB.
 */
const connectDB = async () => {
  const conn = await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`);
};

module.exports = connectDB;
