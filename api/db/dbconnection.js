const mongoose = require('mongoose');

//connect to mongodb

mongoose.connect('mongodb://127.0.0.1:27017/chatapi',{useNewUrlParser:true},()=>{
   //console.log('Db Connected');
});
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
module.exports = mongoose;