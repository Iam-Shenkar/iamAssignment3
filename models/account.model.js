const { Schema, model } = require('mongoose');

const accountSchema = new Schema({
  name: { type: String, required: true },
  plan: { type: String },
  creationDate: { type: Number, required: true },
  assets: [assets],
}, { collection: 'account' });

const account = model('account', accountSchema);

module.exports = account;
