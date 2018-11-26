const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var MatchSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    match_id:{
        type:Number,
        index: true,
        unique: true
    },
    sender_user_id:{
        type: Number,ref:'User',
        required: [true, "can't be blank"],
        index:true
    },
    receiver_user_id:  {
        type: Number,ref:'User',
        required: [true, "can't be blank"],
        index:true
    },
    is_request_accepted:{
        type: Boolean,
        default: false
    },    
    is_sender_user_blocked:{
        type: Boolean,
        default: false
    }    
}, {timestamps: true});

const CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

const matchCounter = mongoose.model('matchcounter', CounterSchema);

MatchSchema.pre('save', function(next) {
    var doc = this;
    matchCounter.findOneAndUpdate({_id: 'matchId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.match_id = counter.seq;
        next();
    });
});

const Match = mongoose.model('Match', MatchSchema);

module.exports =  Match;