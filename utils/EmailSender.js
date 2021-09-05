import nodemailer from 'nodemailer';
//const nodemailer = require("nodemailer");


// async..await is not allowed in global scope, must use a wrapper
async function main(emailList,emailMessage) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMLUSR, // generated ethereal user
      pass: process.env.EMLPWD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"I buy it! informer" <info@ibuyit.me>', // sender address
    to: emailList, // list of receivers
    subject: "Status changed to [Available ✔]", // Subject line
    text: `${emailMessage}`, // plain text body
    html: `${emailMessage}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export const sendEmails = (emailList,emailMessage) => {
  main(emailList,emailMessage).catch(console.error);
}