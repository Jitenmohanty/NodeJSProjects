import mongoose from "mongoose";

export const dbConnect = async()=>{
    try {

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)   
    console.log(`\n Mongodb Connected || DB Host! http://${connectionInstance.connection.host}:${process.env.PORT}`)
    } catch (error) {
        console.log("Something goes wrong!")
        console.log(error)
    }
}

