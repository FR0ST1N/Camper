// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var validUrl = require('valid-url');
var app = express();
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//Redirect when get id
app.get("/:ID", function (request, response) {
  var qr ={"short_url": 'https://url-shortener-njs.glitch.me/'+request.params.ID};
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find(qr).toArray((err, doc)=>{
        if (err) throw err;
        if(doc.length == 0){
          response.send({"error":"This url is not on the database."});
        }else{
          response.redirect(doc[0].original_url);
        }   
      });
    });
});

//Add URL to DB
app.get("/new/:type://:URL", function (request, response) {
  var type = request.params.type; 
  var url = request.params.URL;
  var data = {"error":"This url is not on the database."};
  if (validUrl.isUri(type+'://'+url) && type == 'http' || type == 'https'){
    var tempInt = Math.floor(1000 + Math.random() * 9000);
    data = { "original_url":type+'://'+url, "short_url": 'https://url-shortener-njs.glitch.me/'+tempInt}
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.insert(data,(err,res)=>{
        if(err) throw err;
      });
    });
  }else{
    data = {"error":"Wrong url format, make sure you have a valid protocol and real site."};
  }
  response.send(data);
});

app.get("/new/:site", function (request, response) {
    response.send({"error":"Wrong url format, make sure you have a valid protocol and real site."});
});

// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
