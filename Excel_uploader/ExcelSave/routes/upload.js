import multer from "multer";
import { Router } from 'express';
import { getData, uploadData } from '../controller/upload.controller.js';

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

router.route('/upload').post(upload.single('file'),uploadData)
router.route('/getData').get(getData)

export default router;
