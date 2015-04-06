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

 adminRouter.use(function(req, res, next) {
     // logs of each request
     console.log(req.method, req.url);
     // to do next and go to the route 
     next();
 });
 // output of the middleware for every request 

 // admin main page  http://localhost:1337/admin
 adminRouter.get('/', function(req, res) {
     res.send('le dashboard mate!');
 });

 // showing the users http://localhost:1337/admin/users
 adminRouter.get('/users', function(req, res) {
     res.send('showing all the mtfkr users');
 });

 // showing the users/:name http://localhost:1337/admin/users/:name
 adminRouter.get('/users/:name', function(req, res) {
     res.send('hello  ' + req.params.name + '!');
 });


 // showing the posts http://localhost:1337/admin/posts
 adminRouter.get('/posts', function(req, res) {
     res.send('showing all the mtfkr posts');
 });

 // seinding the html file
 basicRouter.get('/', function(req, res) {
     res.sendFile(path.join(__dirname + '/index.html'));
 });

 // apply the routes to the app
 app.use('/', basicRouter);
 app.use('/admin', adminRouter);
 app.use('/api', apiRouter);


 // starting the server
 app.listen(1337);
 console.log('listening at localhost:1337');
