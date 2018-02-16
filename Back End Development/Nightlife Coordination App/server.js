// server.js
// where your node app starts

// init project
var express = require('express');
var GooglePlaces = require('googleplaces');
var mongodb = require('mongodb');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser')
var googlePlaces = new GooglePlaces(process.env.GOOGLE_PLACES_API_KEY, process.env.GOOGLE_PLACES_OUTPUT_FORMAT);
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;
var app = express();

//Passport Auth Stuff
passport.use(new Strategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: 'https://nightlife-njs.glitch.me/login/twitter/return'
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

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended: false}));


// Handle user query
app.post("/", function (request, response) {
  response.cookie('location', request.body.locationQuery, { maxAge: 24 * 60 * 60 * 1000 * 30, secure: true }); // 30 Days Cookie
  var parameters = {
        query: "restaurants in "+request.body.locationQuery
    };
  magicBox(parameters,request, response);
});

// Get user query
app.get("/", function (request, response) {
  var saved_location = 'dublin';
  var cookie = request.cookies.location;
  if (cookie !== undefined){
    saved_location = cookie;
  }
  var parameters = {
        query: "restaurants in " + saved_location
    };
  magicBox(parameters,request, response);
});

// Add user to :ID
app.get("/add/:ID", function (request, response) {
  if(request.isAuthenticated()){
    var qr ={"pid": (request.params.ID)};
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find(qr).toArray((err, doc)=>{
        if (err) throw err;
        try{
          var temp_users = '';
          if(doc[0].uid == ''){
            temp_users = request.user.id;
          }else{
            temp_users = doc[0].uid+','+request.user.id;
          }
          var update_doc = {$set:{uid: temp_users, score: parseInt(doc[0].score)+1}};
        }catch(e){
          var update_doc = {$set:{pid:request.params.ID, score: 1, uid: request.user.id}};
        }
        
        mongodb.MongoClient.connect(uri, (err, dbase)=>{
          if(err) throw err;
          var dbx = dbase.db(process.env.DB);
          var coll = dbx.collection(process.env.COLLECTION);
           coll.findOneAndUpdate(qr, update_doc, {upsert: true,new: true},(err, doc1)=>{
            if (err) throw err;
            response.redirect('/');    
          });
        });
      });
    });
  }else{
    response.redirect('/');
  }
});

// Remove user from :ID
app.get("/remove/:ID", function (request, response) {  
var qr ={"pid": (request.params.ID)};
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find(qr).toArray((err, doc)=>{
        if (err) throw err;
        if(doc.length == 0){
          response.send({"error":"Place not found."});
        }else{
          if(request.isAuthenticated()){
            var split_users = (doc[0].uid).split(',');
            var index_user = split_users.indexOf(request.user.id);
            if (index_user > -1) {
              split_users.splice(index_user, 1);
            }
            var str_users = '';
            for(var i=0;i<split_users.length;i++){
              if(split_users != ''){
                str_users += split_users[i];
              }
            }
            var update_doc = {$set:{uid: str_users, score: parseInt(doc[0].score)-1}};
              mongodb.MongoClient.connect(uri, (err, dbase)=>{
                if(err) throw err;
                var dbx = dbase.db(process.env.DB);
                var coll = dbx.collection(process.env.COLLECTION);
                coll.update(qr,update_doc,(err, doc1)=>{
                  if (err) throw err;
                    response.redirect('/');    
                  });
                });
              }
            }   
        });
    });
});

// This is where magic happens
function magicBox(parameters,request, response){
  googlePlaces.textSearch(parameters, function (error, res) {
      if (error) throw error;
      mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find().toArray((err, doc)=>{
        if (err) throw err;
        var going = [];
        var uid_results = [];
        for(var i=0;i<res['results'].length;i++){
          uid_results[i] = false;
          going[i] = 0;
          for(var j=0;j<doc.length;j++){
            var uid_split = (doc[j].uid).split(",");
            if(res['results'][i].place_id == doc[j].pid){
              console.log(res['results'][i].place_id +"=="+ doc[j].pid+'  going: '+doc[j].score);
              going[i] = doc[j].score;
              if(request.isAuthenticated()){
              for(var k=0;k<uid_split.length;k++){
              if(uid_split[k] === request.user.id){
                uid_results[i] = true;
                }
              }
            }
            }
          }
        }
         var location = (parameters.query).replace("restaurants in ","");
         if(request.isAuthenticated()){
           console.log(uid_results);
           console.log(going);
            response.render('index', {auth: request.isAuthenticated(), apiData: res['results'], numGoing: going, userName: request.user.username, twitterId: request.user.id, uId: uid_results, query: location});
         }else{
           console.log(going);
            response.render('index', {auth: request.isAuthenticated(), apiData: res['results'], numGoing: going, uId: uid_results, query: location});
         }
      });
    });
    });
}

// Twitter Stuff
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
