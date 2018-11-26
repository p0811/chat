
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");
const User = require('../models/users');
const mailer = require('../mail/mailler');
const config = require('../../config/config');



exports.userSignUp = (req,res,next) =>{
    User.findOne({$or:[{mobile: req.body.mobile},{email_id:req.body.email_id}]})
        .exec()
        .then(user =>{
            if(user){
                return res.status(409).json({
                    message:"Email Id or Mobile Number Already exists"
                });
            }else{
                bcrypt.hash(req.body.password,10,(err,hash) =>{
                    if(err){
                        return  res.status(500).json({
                            error:err
                        });
                    }else{
                        const secreat_token = randomstring.generate();
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name:req.body.name,
                            email_id : req.body.email_id,
                            mobile :  req.body.mobile,
                            password: hash,
                            verify_token:secreat_token
                        });
                        user
                            .save()
                            .then(result => {
                                //compose email 
                                const html = `Hi ${req.body.name},
                                </br>
                                Thank you  for registiring !</br> 
                                please verify you email </br>
                                token:<b>${secreat_token}</b><br>
                                <a href="http://127.0.0.1:3000/users/verify/${secreat_token}"> http://127.0.0.1:3000/users/verify/${secreat_token}</a>
                                <br/><br/>
                                have a fuckoff day !`;
                                // send mail 
                                mailer.sendEmail('admin@gmail.com','Please Vefiry Yor email',req.body.email_id,html)

                                res.status(201).json({
                                    message :'User Created Successfully'
                                });
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error:err
                                });
                            });
                    }
                });
            }
        });
}

exports.userLogin = (req,res,next)=>{
    User.findOne({$or:[{mobile: req.body.mobile},{email_id:req.body.email_id}],is_user_active:true})
        .exec()
        .then(user =>{
            if(user === null){
                return res.status(401).json({
                    message : "Auth Failed"
                });
            }
            bcrypt.compare(req.body.password, user.password,(err,result)=>{
                if(result){
                    const token = jwt.sign(
                        {
                        email_id: user.email_id,
                        user_id:user._id
                        },
                        config.JWT_SECREAT_KEY,
                        {
                            expiresIn :"1hr"
                        },
                     );
                    return res.status(200).json({
                        message : "Auth Successfully",
                        token : token
                    });
                }
                return res.status(401).json({
                    message : "Auth Failed"
                });
            });
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            });
        });
}

exports.changePassword = (req,res,next)=>{
    if(req.body.password === req.body.oldpassword){
        return res.status(406).json({ 
            message : "Old Password and New Password same"
        }); 
    }
    if(req.body.password !== req.body.cnfpassword){
        return res.status(406).json({ 
            message : "Password and Confirm Password Not  Matched"
        }); 
    }
    User.findOne({email_id:req.body.email_id})
        .exec()
        .then(user =>{
            if(user === null){
                return res.status(401).json({
                    message : "Auth Failed"
                });
            }
            bcrypt.compare(req.body.oldpassword, user.password,(err,result)=>{
                if(result){
                    bcrypt.hash(req.body.password,10,(err,hash)=>{
                        if(err){
                            return  res.status(500).json({
                                error:err
                            });
                        }else{
                            User.updateOne({email_id:req.body.email_id},{password:hash},(err,result)=>{
                                if(result){
                                    console.log(result)
                                    return res.status(200).json({
                                        message : "Password Changed Successfully"
                                    });
                                }
                            }).catch(err=>{
                                res.status(500).json({
                                    error : err
                                });
                            });
                        }
                    });
                }else{
                    return res.status(401).json({
                        message : "Auth Failed"
                    });
                }
            });
    });
}

exports.updateProfileImage = (req,res,next) =>{

    User.updateOne({user_id:parseInt(req.params.userid)},{avatar:req.file.path},(err,result)=>{
        if(result.nModified === 1){
            return res.status(200).json({
                message : "Profile Image Successfully Updated"
            });
        }else{
            return res.status(404).json({
                message : "User Not Found"
            });
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });

}

exports.updateProfile = (req,res,next) =>{
    
    User.updateOne({user_id:parseInt(req.params.userid)},{name:req.body.name,about_us:req.body.about_us},(err,result)=>{
        if(result.nModified === 1){
            return res.status(200).json({
                message : "Profile Update Successfully"
            })
        }else{
            return res.status(404).json({
                message : "User Not Found"
            });
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });

}

exports.verifyEmail = (req,res,next) =>{

    User.updateOne({verify_token:req.params.token},{is_email_verified:true,is_user_active:true,verify_token:''},(err,result)=>{
        if(result.nModified === 1){
            return res.status(200).json({
                message : "Email Verified Successfully"
            });
        }else{
            return res.status(404).json({
                message : "User Not Found"
            });
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });
}


exports.removeUser = (req,res,next) =>{
    User.remove({user_id:parseInt(req.params.userid)})
        .exec()
        .then(result => {
            res.status(200).json({
                message:"User Deleted Successfully"
            });
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            });
        });
}
