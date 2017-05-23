// =======================
// get the packages we need
// =======================

var debug = true;
var express     = require('express');
var app         = express();
var path = require('path');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

<<<<<<< HEAD
var config 		= require('./config'); // get our config file
var users  		= require('./routes/users');
var routes 		= require('./routes/index');
var ranks  		= require('./routes/ranks.js');

var server 		= require('http').Server(app);
var io 			= require('socket.io')(server , { pingTimeout: 180000, pingInterval: 50000 });

=======
var config = require('./config'); // get our config file
var users  = require('./routes/users');
var routes = require('./routes/index');
var ranks  = require('./routes/ranks.js');

var server = require('http').Server(app);
var io = require('socket.io')(server);
>>>>>>> parent of eab83e4... all
var map_clients = [];
var geolib = require('geolib');
var User    = require('./app/models/user');

<<<<<<< HEAD
var msgType = ["notoficationFromClient", "dataFromRoute", "acceptJob", "haveRateAccess"];

///========================
///Upload config ==========
///========================
=======
///=======================
///Upload config =========
///=======================
>>>>>>> parent of eab83e4... all

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var jwt     = require('jsonwebtoken');
var fs 		= require("fs");

var multer 	= require("multer");
var upload 	= multer({dest: "./uploads"});

var mongoose = require("mongoose");
mongoose.connect(config.database);

var conn 	= mongoose.connection;

var gfs;

var Grid 	= require("gridfs-stream");
Grid.mongo 	= mongoose.mongo;

// ========================
// configuration ==========
// ========================

var port = process.env.PORT || 3000; // used to create, sign, and verify tokens

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use('/', routes);
app.use('/users', users);
app.use('/ranks', ranks);
app.set('superSecret', config.secret);

// =======================
// upload rutes  =========
// =======================

conn.once("open", function(){
  gfs = Grid(conn.db);

  app.get("/", function(req,res){
    //renders a multipart/form-data form
    res.render("home");
  });
  //second parameter is multer middleware.
  app.post("/upload", upload.single("avatar"), function(req, res, next){

  	var token = req.body.token || req.query.token || req.headers['x-access-token'];

  		if (token) {
	  		jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
		      	if (err) {
		        	return res.json({ success: false, message: err });    
		      	} else {

		      		var patch = decoded._doc._id + '.jpg';
		      		console.log(patch);
			    	//create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
			    	var writestream = gfs.createWriteStream({
			     	 	filename: patch
			    	});
			    	//
			    	// //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
			    	fs.createReadStream("./uploads/" + req.file.filename)
			      	.on("end", function(){fs.unlink("./uploads/"+ req.file.filename, function(err){res.send("success")})})
			        	.on("err", function(){res.send("Error uploading image")})
			          		.pipe(writestream);
			 	}
			 });
	    } else {
	    	res.json({success: false, message: 'Wrong token'});
	    }

  });

  // sends the image we saved by filename.
  app.get("/image/:userID", function(req, res){
  	  var filename = req.params.userID + '.jpg';
      var readstream = gfs.createReadStream({filename: filename});
      readstream.on("error", function(err){
        res.json({success: false, message: "No image found with that title"});
      });
      readstream.pipe(res);
  });

  //delete the image
  app.get("/delete/:userID", function(req, res){
  	var filename = req.params.userID + '.jpg';
    gfs.exist({filename: filename}, function(err, found){
      if(err) return res.json({success: false, message: "Error occured"});
      if(found){
        gfs.remove({filename: filename}, function(err){
          if(err) return res.json({success: false, message: "Error occured"});
          res.json({success: true, message: "Image deleted!"});
        });
      } else{
        res.json({success: false, message: "No image found with that title"});
      }
    });
  });
});

// =======================
// socket.io   ===========
// =======================


io.on('connection', function (socket) {

	map_clients.push(socket);
	if(debug)
		console.info("Client is connected");

	socket.on('changeLocation',function(data){

		if(debug)
		{
			console.info("onChangeLocation");
			console.log(data);
		}

	    if (typeof socket.location == "undefined") {
	      socket.location = [];
	    }

	    if(socket.location.indexOf(data) != "undefined"){
	    	socket.location.splice(socket.location.indexOf(data), 1);
	    }
	    
	    if(data.potrcko){
		    socket.location.push(data);
		}

	    for(var i=0; i < map_clients.length; i++){
      		var client = map_clients[i];
      		if (typeof client.location != "undefined") {
            	if (client.id != socket.id){
            		if(geolib.isPointInCircle(
					    {
					    	latitude: map_clients[i].location.latitude, 
					    	longitude: map_clients[i].location.longitude
					    },
					    {
					    	latitude: data.latitude, 
					    	longitude: data.longitude
					    },
					    data.radius
						)
					)
                		io.to(map_clients[i].id).emit('changeLocation', { data: data });
            	}
            }
        }
	});

	socket.on('allLocation', function(){

		if(debug)
		{
			console.info("allLocation");
		}

		var loc = [];
		for(var i=0; i < map_clients.length; i++){
      		var client = map_clients[i];
      		if (typeof client.location != "undefined") {
            	if (client.id != socket.id)
            		if(geolib.isPointInCircle(
					    {
					    	latitude: map_clients[i].location.latitude, 
					    	longitude: map_clients[i].location.longitude
					    },
					    {
					    	latitude: data.latitude, 
					    	longitude: data.longitude
					    },
					    data.radius
						)
					)
            			loc.push(client.location);
            }
        }
        socket.emit('location', {location: loc});
	});

	socket.on('disconect', function(){

		if(debug)
		{
			console.info("diconect");
		}

		 for(var i=0; i < map_clients.length; i++){
      		var client = map_clients[i];
      		if (typeof client.location != "undefined") {
            	if (client.id != socket.id)
                	io.to(map_clients[i].id).emit('diconected', socket.location);
            }
        }

		map_clients.splice(map_clients.indexOf(socket), 1);
	});

	socket.on('search', function(data){

		User.find(data, function(err, users) {
		    socket.emit('search', users);
		  });

	})
});

// =======================
// start the server ======
// =======================


server.listen(port, function(){
	console.log('Magic happens at http://localhost:' + port);
});
