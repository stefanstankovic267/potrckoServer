var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({ 
    firstname: String, 
    lastname: String,
    email: { type: String, required: true, unique: true },
    birthday: Date,
    reg_date: Date,
    password: String, 
    image: String,
    mob_num: String,
    potrcko: Boolean,
    busy: Boolean,
    radius: Number
}));