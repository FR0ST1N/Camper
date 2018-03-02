// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var ejs = require('ejs');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
var bodyparser = require('body-parser');
var app = express();
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

//Passport Auth Stuff
passport.use(new Strategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: 'https://pinterestclone-njs.glitch.me/login/twitter/return'
},
function(token, tokenSecret, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(session({
  secret: 'potato man',
  resave: false,
  saveUninitialized: true
}))

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended: false}));

app.get("/", function (request, response) {
  if(request.isAuthenticated()){
     mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION1);
      var data = {"uid": request.user.id, "name": request.user.displayName};
      coll.findAndModify({ uid: request.user.id },{},{$setOnInsert: data},{new: true,upsert: true},(err, dbase)=>{
        if(err) throw err;  
      });
    });
  }
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find().toArray((err, doc)=>{
        if (err) throw err;
         if(request.isAuthenticated()){
          response.render('index', { auth: request.isAuthenticated(), user: request.user.id, db: doc });
        }else{
          response.render('index', { auth: request.isAuthenticated(), db: doc });
        } 
      });
    });
});

app.get("/add", function (request, response) {
  if(request.isAuthenticated()){
    response.render('add', { auth: request.isAuthenticated(), user: request.user.id});
  }else{
    response.send({"Error": "Not Authenticated."});
  }
});

app.get("/delete/:ID", function (request, response) {
  if(request.isAuthenticated()){
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.remove({_id: ObjectId(request.params.ID)},(err, doc)=>{
        if (err) throw err
        response.redirect('/user/'+request.user.id);
      });
    });
  }else{
    response.send({"Error": "Not Authenticated."});
  }
});

app.get("/user/:ID", function (request, response) {
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      var coll1 = dbx.collection(process.env.COLLECTION1);
      coll1.find({uid:request.params.ID}).toArray((err, doc1)=>{
         if (err) throw err;
         coll.find({uid:request.params.ID}).toArray((err, doc)=>{
           if (err) throw err;
           if(request.isAuthenticated()){
             response.render('user', { auth: request.isAuthenticated(), name: doc1[0].name, cid: doc1[0].uid ,db: doc ,user: request.user.id});
          }else{
            response.render('user', { auth: request.isAuthenticated(), name: doc1[0].name,cid: doc[0].uid,db: doc,user: 0});
          }  
         });
      });
    });
});

app.post("/new/image", function (request, response) {
  if(request.isAuthenticated()){
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
    if(err) throw err;
    var dbx = dbase.db(process.env.DB);
    var coll = dbx.collection(process.env.COLLECTION);
    coll.insert({uid: request.user.id, img: request.body.imgURL},(err,res)=>{
        if(err) throw err;
        response.redirect('/add');
      });
    }); 
  }else{
    response.send({"Error": "Not Authenticated."});
  }
});

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/login/twitter/return', passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
  console.log(req.user.id);
  res.redirect('/');
});

app.get("/logout/twitter", function (request, response) {
  request.logout();
  response.redirect('/');
});

// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
