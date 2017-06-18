var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Notification', new Schema({ 
    userId: String,
    messages: [{fromUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, messageType: String, data: Object}],
}));