const LocalStorage = require('../data/LocalStorage');
const MongoStorage = require('../data/MongoStorage');
module.exports = class UsersRepository {
    constructor() {
        if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS) {
            this.storage = new MongoStorage('OTP');
        } else {
            this.storage = new LocalStorage('OTP');
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

    updateOne(email, param) {
        return this.storage.updateOne(email, param);
    }

    delete(email) {
        return this.storage.delete(email);
    }

};