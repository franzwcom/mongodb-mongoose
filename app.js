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

 app.get('/', function(req, res) {
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

 /*
  * users
  * http://localhost:1337/api/users
  */
 //.put()
 //.delete();
 apiRouter.route('/users')

 .post(function(req, res) {
         // new user
         var user = new User(); // holy shiet """"""
         user.name = req.body.name;
         user.username = req.body.username;
         user.password = req.body.password;

         user.save(function(err) {
             if (err) {
                 if (err.code = 11000)
                     return res.json({
                         success: false,
                         message: 'user exists here !'
                     });
                 else
                     return res.send(err);

             }
             res.json({
                 message: "user created !"
             });

         }); // end --save()

     }) // end post -------------------------
     .get(function(req, res) {
         User.find(function(err, users) {
             if (err) res.send(err);
             res.json(users);
         });
     }); // end get

 /*
  * single user
  * http://localhost:1337/api/users/:user_id
  */
 apiRouter.route('/users/:user_id')
     .get(function(req, res) {
         User.findById(req.params.user_id, function(err, user) {
             if (err) res.send(err);
             // return the user
             res.json(user);
         });
     }) // end user -------------

 .put(function(req, res) {
         User.findById(req.params.user_id, function(err, user) {
             if (err) res.send(err);

             if (req.body.name) user.name = req.body.name;
             if (req.body.username) user.username = req.body.username;
             if (req.body.password) user.password = req.body.password;

             // saving the user
             user.save(function(err) {
                 if (err) res.send(err);
                 // returning a message
                 res.json({
                     message: 'User updated !'
                 });
             });
         }); // end user.find ----------

     }) // end put ------------------

 .delete(function(req, res) {
     User.remove({
         _id: req.params.user_id
     }, function(err, user) {
         if (err) return res.send(err);
         res.json({
             message: 'Successfully deleted !'
         });
     });
 });

 // apply the routes to the app
 app.use('/', basicRouter);
 app.use('/admin', adminRouter);
 app.use('/api', apiRouter);

 // starting the server
 app.listen(1337);
 console.log('listening at localhost:1337');
