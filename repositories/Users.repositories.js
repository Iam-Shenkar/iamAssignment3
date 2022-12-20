const MongoStorage = require('../data/MongoStorage');

module.exports = class UsersRepository {
    constructor () {
        if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS) {
            this.storage = new MongoStorage('user');
        } else { this.storage = new LocalStorage('users'); }
    }

    find () {
        return this.storage.find();
    }

    retrieve (id) {
        return this.storage.retrieve(id);
    }

    create (obj) {
        return this.storage.create(obj);
    }

    update (id, order) {
        return this.storage.update(id, order);
    }

    delete (id) {
        return this.storage.delete(id);
    }


    typeUser(user) {
        let domain = user.email.split("@");
        domain = domain[1].split(".");
        if (domain.find(element => element === "shenkar")) {
            return "admin"
        } else {
            return "user"
        }
    }

    getUserByEmail(email){
        let mail = email.toString().toLowerCase()
        return this.storage.findOne({email: mail})
    }


      addUser = async (user) =>  {
        if (user.password){
            user.password = await bcrypt.hash(user.password, 12);}
        const domain = typeUser(user)
        const newUser = new User({
            "name": user.name,
            "email": user.email,
            "password": user.password,
            "type": domain});

        this.storage.create()
    }



};