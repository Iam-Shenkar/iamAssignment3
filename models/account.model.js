const { Schema, model } = require('mongoose');

const accountSchema = new Schema({
  name: { type: String, required: true },
  plan: { type: String, default: 'free' },
  creationDate: { type: Date, default: new Date() },
  assets: {
    credits: { type: Number, default: 0 },
    seats: { type: Number, default: 0 },
    features: [String],
  },
}, { collection: 'account' });

const account = model('account', accountSchema);

module.exports = account;