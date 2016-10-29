var express = require('express');
var app     = express();
var router  = express.Router();

var Rate    = require('../app/models/rate');
var jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config  = require('../config'); // get our config file


app.set('superSecret', config.secret); // secret variable

router.get('/', function(req, res){
	Rate.find({}, function(err, rank) {
	   res.json(rank);
	});
});

router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: err });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.json({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

router.post('/ranks', function(req, res) {
  Rate.find({email: req.body.email}, function(err, ranks) {
	   res.json(ranks);
	});
});

router.post('/rated', function(req, res) {
  Rate.find({email: req.body.email}, function(err, ranks) {
	   res.json(req.decoded._doc.email);
	});
});

module.exports = router;