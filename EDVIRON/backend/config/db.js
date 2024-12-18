const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\nMongodb Connected || DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Mongodb Connection Failed!", error);
    process.exit(1);
  }
};

module.exports = connectToDB;
