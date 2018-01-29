// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const GoogleImages = require('google-images');
var mongodb = require('mongodb');
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

const client = new GoogleImages(process.env.CSE, process.env.API);

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/imagesearch/:key", function (request, response) {
  var imageList = new Array();
  client.search(request.params.key, {page: request.query.offset}).then(images => {
    for(var i = 0; i < images.length; i++){
      imageList.push({"url":images[i].url,"description":images[i].description,"pageUrl":images[i].parentPage});
    }
    var data = { "term":request.params.key,"offset":request.query.offset,"when": new Date().toISOString()}
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.insert(data,(err,res)=>{
        if(err) throw err;
      });
    });
    response.send(imageList);
  });
});

app.get("/api/latest/imagesearch", function (request, response) {
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.find().sort({_id: -1}).project({"_id":0}).limit(5).toArray((err, doc)=>{
        if (err) throw err;
        response.send(doc);
      });
    });
});

// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
