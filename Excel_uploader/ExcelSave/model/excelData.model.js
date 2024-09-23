import mongoose from "mongoose";

const ExcelData = new mongoose.Schema({
    SL_NO:{
        type:String,
    },
    VILLAGE_COLLECTION:{
        type:String,
        required:true,
        default:"Never disclose the donner name"
    },
    AMOUNT:{
        type:String,
        default:0
    },
});

export const Data = mongoose.model("ExcelData",ExcelData)