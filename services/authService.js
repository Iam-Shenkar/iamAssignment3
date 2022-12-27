const bcrypt = require('bcrypt');
const generator = require('generate-password');
const UsersRepository = require('../repositories/Users.repositories');
const { sendEmail } = require('../sendEmail/sendEmail');

const User = new UsersRepository();

const unSuspend = async (user) => {
  await User.update(user.email, {
    status: 'active',
    suspensionTime: 0,
    suspensionDate: 0,
  });
};

const validPassword = async (pass, userPassword) => {
  if (!await bcrypt.compare(pass, userPassword)) throw new Error('incorrect password');
};

const userExist = async (email) => {
  const userEmail = email.toLowerCase();
  const user = await User.retrieve({ email: userEmail });
  if (!user) throw new Error("user doesn't exist");
  return user;
};

const userNotExist = async (email) => {
  const userEmail = email.toLowerCase();
  const user = await User.retrieve(userEmail);
  if (user) throw new Error('User already exists');
};

const statusCheck = async (user) => {
  switch (user.status) {
    case 'active':
      break;
    case 'closed':
      throw new Error('User is closed');
      break;

    case 'suspended':
      const suspendTime = parseInt(user.suspensionTime, 10);
      const suspendStartDate = user.suspensionDate;
      const dateExpired = suspendStartDate;

      dateExpired.setDate(suspendStartDate.getDate() + suspendTime);
      if (dateExpired > new Date()) {
        console.log(`user: ${user.email} is suspended- login failed`, 'ERROR');
        throw new Error(`User is suspended until ${dateExpired}`);
      } else {
        await unSuspend(user);
      }
      break;
  }
};

const generatePassword = () => {
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  return password;
};

const sendEmailPassword = async (newPass, user) => {
  const mailData = {
    path: '/sendEmail/newPassMail.ejs',
    subject: 'New Password',
    email: user.email,
  };
  const details = {
    name: `${user.name}`,
    pass: `${newPass}`,
  };
  await sendEmail(mailData, details);
};

module.exports = {
  userNotExist,
  statusCheck,
  userExist,
  validPassword,
  generatePassword,
  sendEmailPassword,
  User,
};
