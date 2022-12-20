const { EventEmitter } = require('events');
const mongoose = require('mongoose');
const Path = require('path');

class MongoStorage extends EventEmitter {
    constructor (entity) {
        super();

        this.entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
        this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
        this.connect();
    }

    connect () {
        const connectionUrl = process.env.DB_HOST;
        mongoose
            .connect(connectionUrl)
            .then(() => console.log(`connected to ${this.entityName} collection`))
            .catch(err => console.log(`connection error: ${err}`));
    }

    find () {
        return this.Model.find({});
    }

    retrieve (id) {
        return this.Model.retrieve({ id });
    }

    create (data) {
        const entity = new this.Model(data);
        entity.save();
    }

    delete (id) {
        return this.Model.deleteOne({ id });
    }

    update (id, data) {
        return this.Model.updateOne({ id }, data);
    }
};

module.exports = {MongoStorage}