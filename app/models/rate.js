var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Rank', new Schema({ 
    ranks: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //rangira
    rated: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //rangiran
    stars: Number,
    comment: String,
    rateDate: Date
}));
