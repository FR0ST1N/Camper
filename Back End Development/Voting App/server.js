// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
var bodyparser = require('body-parser');
var ejs = require('ejs');
var app = express();
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

//Passport Auth Stuff
passport.use(new Strategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: 'https://voting-njs.glitch.me/login/twitter/return'
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

//Routing,DB and everything nice
app.get("/", function (request, response) {
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find().toArray((err, doc)=>{
        if (err) throw err;
        if(request.isAuthenticated()){
          response.render('index', { auth: request.isAuthenticated(), displayName: request.user.displayName, userName: request.user.username, dbData: doc});
        }else{
          response.render('index', { auth: request.isAuthenticated(), dbData: doc});
        }
      });
    });
});

app.post("/user/create-poll", function (request, response) {
  var option_len = (request.body.options).split(',').length;
  var option = '';
  for(var i=0;i<option_len;i++){
    if(i == option_len - 1){
      option += '0';
    }else{
      option += '0,';
    }
  }
  var temp_date = Date.now();
  var poll_data = {"uid": request.user.id,"question": request.body.question,"options": request.body.options,"votes": option, "date": temp_date, "link": (request.user.id).toString()+temp_date.toString()};
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.insert(poll_data,(err,res)=>{
        if(err) throw err;
      });
    });
  response.redirect('/poll/'+(request.user.id).toString()+temp_date.toString());
});

app.get("/user/new", function (request, response) {
  if(request.isAuthenticated()){
    response.render('newpoll', { auth: request.isAuthenticated(), userName: request.user.username});
  }else{
    response.redirect('/');
  }
});

app.post("/poll/submit-vote/:ID", function (request, response) {
  var qr ={"link": request.params.ID};
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find(qr).toArray((err, doc)=>{
        if (err) throw err;
        if(doc.length == 0){
          response.send({"error":"Poll not found."});
        }else{
          //var data;
          var set_data;
          var votes_arr = doc[0].votes.split(',');
          var votes_str = '';
          if(request.body.option_data_client != "add_custom_option"){
            votes_arr[parseInt(request.body.option_data_client)]++;
            for(var i=0;i<votes_arr.length;i++){
              if(i == votes_arr.length - 1){
                votes_str += votes_arr[i];
              }else{
                votes_str += votes_arr[i]+',';
              }
            }
            set_data = {$set:{
            "votes": votes_str
          }};
          }else{
            set_data={$set:{
            "options":doc[0].options+','+request.body.new_option_input,
            "votes":doc[0].votes+','+1
          }};
          }
          coll.update(qr,set_data, (err, res)=>{
              if(err) throw err;
            response.redirect('/poll/'+request.params.ID);
          });
        }   
      });
    });
});

app.get("/user/manage", function (request, response) {
  if(request.isAuthenticated()){
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find({"uid": request.user.id}).toArray((err, doc)=>{
        if (err) throw err;
        if(request.isAuthenticated()){
          response.render('manage', { auth: request.isAuthenticated(), userName: request.user.username, dbData: doc});
        }
      });
    });
  }else{
    response.redirect('/');
  }
});

app.get("/poll/:ID", function (request, response) {
  var qr ={"link": (request.params.ID).replace("/poll/","")};
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find(qr).toArray((err, doc)=>{
        if (err) throw err;
        if(doc.length == 0){
          response.send({"error":"Poll not found."});
        }else{
          if(request.isAuthenticated()){
            response.render('poll', { auth: request.isAuthenticated(), userName: request.user.username, dbData: doc});
          }else{
              response.render('poll', { auth: request.isAuthenticated(), dbData: doc});
          }
        }   
      });
    });
});

app.get("/user/delete/:ID", function (request, response) {
  var qr ={"link": (request.params.ID)};
  if(request.isAuthenticated()){
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.remove(qr,(err, doc)=>{
        if (err) throw err;
        if(doc.length == 0){
          response.send({"error":"Poll not found."});
        }else{
         response.redirect('/user/manage'); 
        }   
      });
    });
  }else{
    response.redirect('/');
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
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
