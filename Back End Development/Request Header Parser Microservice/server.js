// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

app.get("/", function (request, response) {
  var tempIP = request.header('x-forwarded-for');
  var IP = tempIP.substr(0, tempIP.indexOf(','));
  var tempLang = request.header('accept-language');
  var lang = tempLang.substr(0, tempLang.indexOf(','));
  var tempUA = request.header('user-agent');
  var UA = tempUA.substr(tempUA.indexOf('(')+1, tempUA.length);
  UA = UA.substr(0, UA.indexOf(')'));
  response.end(JSON.stringify({"ipaddress":IP,"language":lang,"software":UA}));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
