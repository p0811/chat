const mongoose = require('mongoose');
const ImageUpload = require('../models/usersImage');

exports.uploadImage = (req,res,next) =>{

    const usrImg = new ImageUpload({
        _id:mongoose.Types.ObjectId(),
        avatar: req.file.path,
        user_id : parseInt(req.body.user_id)
    });
    usrImg
        .save()
        .then(result => {
            res.status(201).json({
                message :'Image Upload Successfully'
            });
        })
        .catch(err =>{
            res.status(500).json({
                error:err
            });
        });
}