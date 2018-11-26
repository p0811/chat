const express = require('express');
const app = express();
const morgan = require('morgan');

const mongoose = require('./api/db/dbconnection');

const userRoutes = require('./api/routes/users');
const userImageRoutes = require('./api/routes/usersImage');
const matchRoutes = require('./api/routes/match');


app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((req,res,next) => {
    res.header("Access-Controll-Allow-Origin",'*');
    res.header(
        "Access-Controll-Allow-Headers",
        "Origin,X-Requested-With,Content_Type,Accept,Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Controll-Allow-Method','PUT,POST,GET,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
})

app.use('/users',userRoutes);
app.use('/usersImage',userImageRoutes);
app.use('/match',matchRoutes);

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404 ;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message 
        }
    })
});
module.exports = app;