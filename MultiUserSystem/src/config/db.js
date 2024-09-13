import mongoose from "mongoose";

const connectToDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Mongodb Connected || DB Host! ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongodb Connection Failed!",error)
        process.exit(1);
    }
}