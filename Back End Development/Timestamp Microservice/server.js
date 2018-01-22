// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

//global var
var nTime;
var uTime;

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:data", function (request, response) {
  theTimeMachine(request.params.data);
  response.send(JSON.stringify({"unix":uTime,"natural":nTime}));
});

function theTimeMachine(reqTime){
  var monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  nTime = null;
  uTime = null;
  //natural time
  if(new Date(reqTime).getTime() > 0){
    nTime = reqTime;
    uTime = parseInt(new Date(reqTime).getTime()/1000);
  //unix
  }else if(new Date(reqTime*1000).getTime() > 0){
    var dateObj = new Date(reqTime*1000);
    nTime = monthsArr[dateObj.getMonth()] + ' ' + dateObj.getDate() + ', ' + dateObj.getFullYear();
    uTime = parseInt(reqTime);
  }
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
