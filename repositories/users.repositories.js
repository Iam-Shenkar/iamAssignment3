const MongoStorage = require('../data/MongoStorage');

module.exports = class UsersRepository {
  constructor() {
    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS) {
      this.storage = new MongoStorage('user');
    }
  }

  find(param) {
    return this.storage.find(param);
  }

  retrieve(param) {
    return this.storage.retrieve(param);
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

  deleteMany(param) {
    return this.storage.deleteMany(param);
  }

  updateMany(param, data) {
    return this.storage.updateMany(param, data);
  }
};
