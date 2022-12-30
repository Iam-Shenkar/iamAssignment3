const { EventEmitter } = require('events');
const fs = require('fs');
const Path = require('path');

module.exports = class LocalStorage extends EventEmitter {
  constructor(entity) {
    super();
    this.dir = Path.join(__dirname, `./${entity}.json`);

    this.on('update-storage', () => {
      fs.writeFile(this.dir, JSON.stringify(this.storage.data), 'utf8', (err) => {
        if (err) throw err;
        console.log('File has been saved!');
      });
    });
    this.connect();
  }

  connect() {
    this.storage = {
      data: require(this.dir),
      save: () => this.emit('update-storage'),
    };
  }

  find() {
    return Promise.resolve(this.storage.data);
  }

  retrieve(email) {
    return Promise.resolve(this.storage.data.find((item) => item.email === email));
  }

  create(data) {
    const result = this.storage.data.push(data);
    this.storage.save();
    return Promise.resolve(result);
  }

  delete(id) {
    const result = this.storage.filter((item) => item.id !== id);
    this.storage.save(result);
    return Promise.resolve(result);
  }

  update(id, data) {
    const result = this.storage.map((item) => (item.id === id ? ({ item, ...data }) : item));
    this.storage.save();
    return Promise.resolve(result);
  }
};
