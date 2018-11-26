const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
//const userCounter = require('./counter');

var UserSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:{
        type:Number,
        index: true,
        unique: true
    },
    name:{
        type: String,
        lowercase: true,
        required: [true, "can't be blank"]
        //match: [/^[a-zA-Z0-9]+$/, 'is invalid']
    },
    email_id:  {
      type: String, 
      lowercase: true, 
      required: [true, "can't be blank"], 
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 
      index: true,
      unique: true
    },
    mobile:{
        type: String,
        unique: true,
        // validate: {
        //     validator: function(v) {
        //     return /\d{3}-\d{3}-\d{4}/.test(v);
        // },
        // message: props => `${props.value} is not a valid phone number!`
        // },
        index: true,
        required: [true, 'User mobile number required']
    },
    avatar:  {
        type: String,
    },
    about_us : String,
    password:{
        type:String,
        required : true
    },
    verify_token : String,
    is_email_verified : {
        type:Boolean,
        default :false
    },
    is_user_active : {
        type:Boolean,
        default :false
    },   
}, {timestamps: true});



const CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

const userCounter = mongoose.model('usercounter', CounterSchema);

UserSchema.pre('save', function(next) {
    var doc = this;
    userCounter.findOneAndUpdate({_id: 'userId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.user_id = counter.seq;
        next();
    });
});

UserSchema.plugin(uniqueValidator);
const Users = mongoose.model('User', UserSchema);

module.exports =  Users;

