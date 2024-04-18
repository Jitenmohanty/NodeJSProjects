import mongoose from "mongoose";

const dbConnect = async()=>{
    try {

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)   
    console.log(`\n Mongodb Connected || DB Host! ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Something goes wrong!")
        console.log(error)
    }
}

export default dbConnect;
