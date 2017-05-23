var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('FromRate', new Schema({ 
    userId: String,
    courierId: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}));