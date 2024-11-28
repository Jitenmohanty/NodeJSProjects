import multer from "multer";
import { Router } from 'express';
import { filterData, getData, uploadData } from '../controller/upload.controller.js';
import { uploadCandidateDataExcelFile } from "../controller/uploadCandidateData.controller.js";

const router = Router();
const storage = multer.diskStorage({
    // where you want to save...
    destination:function(req,file,cb){
        cb(null,'./public/temp')
    },
    //save with original name
    filename:function(req,file , cb){
        cb(null , file.originalname)
    }
})
 const upload = multer({
    storage,
})

// router.route('/upload').post(upload.single('file'),uploadData)
router.route('/upload').post(uploadCandidateDataExcelFile)
router.route('/getData').get(getData)
router.route("/filter").get(filterData)

export default router;
