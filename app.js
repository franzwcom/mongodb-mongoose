 /*
  *  simple connection to mongodb and mongoose
  *  --------------------------------------------------------
  *  Source: 
  */

 var express = require('express');
 var app = express();
 var bodyParser = require('body-parser');
 var morgan = require('morgan'); // used to see requests
 var path = require('path');
 var mongoose = require('mongoose');
 var dbname = 'simplemongodb';

 // app config
 app.use(bodyParser.urlencoded({
     extended: true
 }));
 app.use(bodyParser.json());
/*
 * configure the app to handle CORS requests
 */
  app.use(function(req, res, next) {
     res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
        next();
 });


 /*
 |-----------------------------------------------------------
 | mongoose and mongo set up 
 |-----------------------------------------------------------
 */
 mongoose.connect('mongodb://localhost/' + dbname);
 var db = mongoose.connection;
 db.on("error", console.error);
 db.once("open", function(callback) {
     console.log("MongoDB connection established to " + dbname);
 });



app.get('/', function(req, res){
  res.send('welcome to API');
});


/*____________________ user _____________________*/
var User = require('./models/user');
 /*
  * routes for the api
  */

 // getting an instance of the router
 var basicRouter = express.Router();
 var adminRouter = express.Router();
 var apiRouter = express.Router();

 /*
  *   adding a simple middleware to message to the console
  *   to see the request everytime is made
  *   --------------------------------------------------------
  *   Note: A middleware must be in between the the adminRouter declaration
  *   and the routes, basically here :D
  */

 apiRouter.use(function(req, res, next) {
     // logs of each request
     console.log(req.method, req.url);
     // to do next and go to the route 
     next();
 });
 // output of the middleware for every request 

 // accessed at http://localhost:1337/api
 apiRouter.get('/', function(req, res) {
     res.json({
         message: 'welcome to the API'
     });
 });

 // apply the routes to the app
 app.use('/', basicRouter);
 app.use('/admin', adminRouter);
 app.use('/api', apiRouter);


 // starting the server
 app.listen(1337);
 console.log('listening at localhost:1337');