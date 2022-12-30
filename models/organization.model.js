const { Schema, model } = require('mongoose');

const organizationSchema = new Schema({
  name: { type: String, required: true },
  plan: { type: String },
  numOfSits: { type: Number, required: true },
  creationDate: { type: Number, required: true },
}, { collection: 'organization' });

const organization = model('organization', organizationSchema);

module.exports = organization;
