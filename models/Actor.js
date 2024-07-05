const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    username: String, //username of actor - acts as a key to this actor
    profile: { //profile of this actor
        name: String,
        picture: String
    }
}, { timestamps: true });

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;