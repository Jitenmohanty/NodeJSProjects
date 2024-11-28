const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

module.exports.connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    console.log(`\n Mongodb Connected || DB Host! ${connectionInstance.connection.host}`)
} catch (error) {
    console.log("Mongodb Connection Failed!",error)
    process.exit(1);
}
};
