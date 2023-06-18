const nodemailer = require('nodemailer')

const sendmail = async(option)=>
{
    const transport = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        service: "Gmail",
        secure:true,
        auth: {
            user: process.env.EMAIL_GMAIL,
            pass: process.env.PASSWORD_GMAIL
        }
    });
    var mailOptions = 
        {
        from: `DOCBOOK <DocBook012@gmail.com>`,
        to: option.email, 
        subject: 'Reset The Password',
        html:option.message
        } 
    await transport.sendMail(mailOptions)
}

module.exports = sendmail