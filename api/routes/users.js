const express = require('express');
const multer = require('multer');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const userControllers = require('../controllers/userControllers');


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/profile')
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

router.post('/sigup',userControllers.userSignUp);
router.post('/login',userControllers.userLogin);
router.post('/changepassword',checkAuth,userControllers.changePassword);
router.put('/updateprofileimage/:userid',checkAuth,upload.single('avatar'),userControllers.updateProfileImage);
router.put('/updateProfile/:userid',checkAuth,userControllers.updateProfile);


router.get('/verify/:token',userControllers.verifyEmail);

router.delete('/:userid',checkAuth,userControllers.removeUser);

module.exports = router;