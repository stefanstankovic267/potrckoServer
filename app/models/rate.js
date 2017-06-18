var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Rank', new Schema({ 
    emailRanks: String, //rangira
    emailRated: String, //rangiran
    stars: Number,
    comment: String,
    rateDate: Date
}));
