// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

server.listen(3000);
app.use(express.static('public'));

//Basic Routing
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//Socket.io Stuff
io.on('connection', function (socket) {
  fetchData(socket, 0); //Initial Data Load from DB
  
  //When stock is added 
  socket.on('add-stock', function (data) {
    console.log(data);
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.findAndModify({ scode: data.scode },{},{$setOnInsert: data},{new: true,upsert: true},(err, dbase)=>{
        if(err) throw err;
        fetchData(socket, 1);
      });
    });
  });
  
  //When stock is removed
  socket.on('remove-stock', function (data){
    mongodb.MongoClient.connect(uri, (err, dbase)=>{
      if(err) throw err;
      var dbx = dbase.db(process.env.DB);
      var coll = dbx.collection(process.env.COLLECTION);
      coll.remove(data,(err, doc)=>{
        if (err) throw err;
        fetchData(socket, 1);
      });
    });
  });
});

//Fetch Data from DB
function fetchData(socket, emitMode){
  mongodb.MongoClient.connect(uri, (err, dbase)=>{
    if(err) throw err;
    var dbx = dbase.db(process.env.DB);
    var coll = dbx.collection(process.env.COLLECTION);
    coll.find().toArray((err, doc)=>{
      if (err) throw err;
      if(emitMode == 0){
        socket.emit('stock', doc);  
      } else if(emitMode == 1){
        io.sockets.emit('stock', doc);
      } 
    });
  });
}

