var express = require('express');
var app     = express();
var router  = express.Router();

var User    = require('../app/models/user'); // get our mongoose model
var jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config  = require('../config'); // get our config file


app.set('superSecret', config.secret); // secret variable

/* GET users listing. */

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) res.json({ success: false, err: err });

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
       
        
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: '2 days'// expires in 24 hours
        });

        delete user.password;
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          user: user
        });
      }   

    }
  });
});

router.post('/singup', function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) res.json({ success: false, message: err });;

    if (!user) {

		  var nick = new User({ 
		    firstname: req.body.firstname, 
		    lastname: req.body.lastname,
		    email: req.body.email,
		    birthday: new Date(req.body.birthday),
		    reg_date: new Date(),
		    password: req.body.password, 
		    image: '',
		    mob_num: req.body.mob_num,
		    potrcko: req.body.potrcko,
		    busy: req.body.busy
		  });

		  // save the sample user
		  nick.save(function(err) {
		    if (err) res.json({ success: false, message: err });
		    User.findOne({
			    email: req.body.email
			  }, function(err, user) {

			    if (err) res.json({ success: false, message: err });

		        // if user is found and password is right
		        // create a token		   	 
		        var token = jwt.sign(user, app.get('superSecret'), {
		          expiresIn: '2 days'// expires in 24 hours
		        });

		        // return the information including token as JSON
		        delete user.password;

		        res.json({
		          success: true,
		          message: 'Enjoy your token!',
		          token: token,
		          user: user
		        });		
			  });		    	
		  });

    } else if (user) {
        res.json({ success: false, message: 'SingUp failed. User exsist.' });
    }  
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

router.post('/', function(req, res) {
  res.json(req.decoded._doc);
});

router.post('/update', function(req, res) {
  console.log(req.body);
  User.findOneAndUpdate(
    {email: req.decoded._doc.email}, // query
    req.body, //for change
    function(err, user) {
        if (err){
            res.json({success: false, message: err});  // returns error if no matching object found
        }else{
            res.json({success: true, user: user});
        }
    });
});



module.exports = router;
