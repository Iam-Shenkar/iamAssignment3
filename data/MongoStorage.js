const { EventEmitter } = require('events');
const mongoose = require('mongoose');
const Path = require('path');

mongoose.set('strictQuery', true);
module.exports = class MongoStorage extends EventEmitter {
  constructor(entity) {
    super();

    this.entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
    this.connect();
  }

  connect() {
    const connectionUrl = process.env.DB_HOST;
    mongoose
      .connect(connectionUrl)
      .then(() => console.log(`connected to ${this.entityName} collection`))
      .catch((err) => console.log(`connection error: ${err}`));
  }

  find(param) {
    return this.Model.find(param);
  }

  retrieve(param) {
    return this.Model.findOne(param);
  }

  create(data) {
    const entity = new this.Model(data);
    entity.save();
  }

  delete(email) {
    return this.Model.deleteOne(email);
  }

  deleteMany(param) {
    return this.Model.deleteMany(param);
  }

  update(param, data) {
    return this.Model.findOneAndUpdate(param, data);
  }

  updateMany(param, data) {
    return this.Model.updateMany(param, data);
  }
};
