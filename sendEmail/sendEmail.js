const node = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');
const ejs = require('ejs');

const transporter = node.createTransport(smtp({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'IamTeamShenkar@gmail.com',
    pass: process.env.email,
  },
}));
const sendEmail = async (dataMail, details) => {
  const data = await ejs.renderFile(process.cwd() + dataMail.path, details);
  const mainOptions = {
    from: process.env.emailShenkar,
    to: dataMail.email,
    subject: 'Please Verify you Account',
    html: data,
  };
    // send the mail with the OTP to the client email
  await transporter.sendMail(mainOptions, (err) => {
    if (err) {
      throw new Error('transporter error: mail was not sent');
    } else {
    }
  });
};

module.exports = { sendEmail };
