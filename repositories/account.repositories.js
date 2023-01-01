const MongoStorage = require('../data/MongoStorage');

module.exports = class AccountRepository {
  constructor() {
    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS) {
      this.storage = new MongoStorage('account');
    }
  }

  find() {
    return this.storage.find();
  }

  retrieve(email) {
    return this.storage.retrieve(email);
  }

  create(obj) {
    return this.storage.create(obj);
  }

  update(param, data) {
    return this.storage.update(param, data);
  }

  delete(email) {
    return this.storage.delete(email);
  }
};
