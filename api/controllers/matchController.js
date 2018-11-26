const mongoose = require('mongoose');
const Match = require('../models/match');

exports.sendMatchRequest = (req,res,next) =>{
    Match.findOne({sender_user_id: parseInt(req.body.sender_user_id),receiver_user_id:parseInt(req.body.receiver_user_id)})
    .exec()
    .then(user=>{
        if(user === null){
            const match = new Match({
                _id: new mongoose.Types.ObjectId(),
                sender_user_id:parseInt(req.body.sender_user_id),
                receiver_user_id : parseInt(req.body.receiver_user_id),
            });
            match
                .save()
                .then(result => {
                    res.status(201).json({
                        message :'Send Request Successfully'
                    });
                })
            .catch(err =>{
                res.status(500).json({
                    error:err
                });
            });
        }else{
            res.status(201).json({
                message :'Already  Requested'
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    });
}

exports.acceptMatchRequest = (req,res,next) =>{
    Match.updateOne({sender_user_id: parseInt(req.body.sender_user_id),receiver_user_id:parseInt(req.body.receiver_user_id)},{is_request_accepted:true},(err,result)=>{
        if(result.nModified === 1){
            console.log(result.nModified)
            return res.status(200).json({
                message : "Match Request Accepted"
            });
        }else{
            console.log(result.nModified)
            return res.status(404).json({
                message : "user not found"
            });
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });
}

exports.rejectMatchRequest = (req,res,next) =>{
    Match.remove({sender_user_id: parseInt(req.body.sender_user_id),receiver_user_id:parseInt(req.body.receiver_user_id)})
        .exec()
        .then(result => {
            res.status(200).json({
                message:"Rejected Successfully"
            });
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            });
        });
}

exports.blockAcceptedUser = (req,res,next) =>{
    Match.updateOne({sender_user_id:parseInt(req.body.sender_user_id),receiver_user_id:parseInt(req.body.receiver_user_id),is_request_accepted:true},{is_sender_user_blocked:true},(err,result)=>{
        if(result.nModified === 1){
            console.log(result.nModified)
            return res.status(200).json({
                message : "User Successfully Blocked"
            });
        }else{
            console.log(result.nModified)
            return res.status(404).json({
                message : "user not found"
            });
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });
}

exports.unblockAcceptedUser = (req,res,next) =>{
    Match.updateOne({sender_user_id:parseInt(req.body.sender_user_id),receiver_user_id:parseInt(req.body.receiver_user_id),is_sender_user_blocked:true},{is_sender_user_blocked:false},(err,result)=>{
        if(result.nModified === 1){
            console.log(result.nModified)
            return res.status(200).json({
                message : "User Successfully Unblocked"
            });
        }else{
            console.log(result.nModified)
            return res.status(404).json({
                message : "user not found"
            });
        }
    }).catch(err =>{
        res.status(500).json({
            error:err
        });
    });
}