const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname)
    }
});
const fileFilter = (req,file,cb) => {
    // reject file 
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ){
        cb(null,true);
    }else{
        cb(null,false);
    }
   
    
}
const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
});

const imageUploadController = require('../controllers/imageUploadController');

router.post('/',checkAuth,upload.single('avatar'),imageUploadController.uploadImage);

module.exports = router;