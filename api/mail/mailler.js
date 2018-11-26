
const nodemailer = require('nodemailer');
const mailerConfig = require('../../config/mailer');

const transporte = nodemailer.createTransport({
    service :'Mailgun',
    auth:{
        user:mailerConfig.MAILGUN_USER,
        pass:mailerConfig.MAILMAILGUN_PASSWORD
    },
    tls:{
        rejectUnauthorized:false
    }
});

module.exports = {
    sendEmail(from,subject,to,html){
        return new Promise((resolve,reject)=>{
            transporte.sendMail({from,subject,to,html},(err,info)=>{
                if(err) reject(err);

                resolve(info);

            })
        })
    }
}