const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UsersImageSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    image_id:{
        type:Number,
        index: true,
        unique: true
    },

    user_id:{
        type: Number,ref:'User',
        required: [true, "can't be blank"],
        index:true,
    },
    avatar:  {
      type: String,
      required: [true, "can't be blank"], 
    }  
}, {timestamps: true});


const UsersImage = mongoose.model('UserImage', UsersImageSchema);

const CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

const imageUploadCounter = mongoose.model('imagecounter', CounterSchema);

UsersImageSchema.pre('save', function(next) {
    var doc = this;
    imageUploadCounter.findOneAndUpdate({_id: 'imageId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.image_id = counter.seq;
        next();
    });
});

module.exports =  UsersImage;

