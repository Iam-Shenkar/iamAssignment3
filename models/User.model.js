const {model, Schema} = require('mongoose');


const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, set: email => email.toLowerCase()},
    password: {type: String, required: true},
    loginDate: {type: Date, default: new Date()},
    type: {type: String, default: 'user'},
    status: {type: String, default: 'active'},
    suspensionTime: {type: Number, default: 0},
    suspensionDate: {type: Date, default: 0},
    googleId: {type: String, default: null},
    refreshTokens: {type: String, default: null}
}, {collection: 'user'});

const User = model('user', userSchema);

module.exports = User;
