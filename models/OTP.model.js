const { Schema, model } = require('mongoose');

const otpSchema = new Schema({
  email: { type: String, required: true, set: (email) => email.toLowerCase() },
  code: { type: String, required: true },
  creationDate: { type: Date, required: true },
}, { collection: 'OTP' });

const OTP = model('OTP', otpSchema);

module.exports = OTP;
