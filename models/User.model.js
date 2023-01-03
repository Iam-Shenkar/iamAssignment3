const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  name: { type: String },
  email: {
    type: String, required: true, set: (email) => email.toLowerCase(),
  },
  password: { type: String },
  loginDate: { type: Date, default: new Date() },
  type: { type: String, default: 'manager' },
  gender: { type: String, default: 'Fish' },
  status: { type: String, default: 'active' },
  suspensionTime: { type: Number, default: 0 },
  suspensionDate: { type: Date, default: 0 },
  googleId: { type: String, default: null },
  refreshToken: { type: String, default: null },
  accountId: { type: String },
}, { collection: 'user' });

const User = model('user', userSchema);

module.exports = User;
