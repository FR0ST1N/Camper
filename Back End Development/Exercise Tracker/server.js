// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var bodyparser = require('body-parser');
var app = express();
var uri = 'mongodb://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST + ':' + process.env.PORT + '/' + process.env.DB;
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyparser.urlencoded({
    extended: false
}));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.post("/new", function (request, response) {
    mongodb.MongoClient.connect(uri, (err, dbase) => {
        if (err) throw err;
        var dbx = dbase.db(process.env.DB);
        var coll = dbx.collection(process.env.COLLECTION);
        var uid = Math.floor(100000 + Math.random() * 900000);
        var nUser = {
            "uid": uid,
            "username": request.body.newUser
        };
        coll.findOne({
            "username": request.body.newUser
        }, function (err, docs) {
            if (err) throw err;
            if (docs) {
                response.send({
                    "error": "username already taken."
                });
                response.send(docs);
            } else {
                coll.insertOne(nUser, (err, doc1) => {
                    if (err) throw err;
                    response.send(nUser);
                });
            }
        });
    });
});

app.post("/add", function (request, response) {
    mongodb.MongoClient.connect(uri, (err, dbase) => {
        if (err) throw err;
        var dbx = dbase.db(process.env.DB);
        var coll = dbx.collection(process.env.COLLECTION1);
        var d = request.body.date;
        if (request.body.date == "") {
            var dt = new Date();
            d = dt.getFullYear() + "-" + dt.getMonth() + 1 + "-" + dt.getDate();
        }
        var ex = {
            "uid": request.body.uid,
            "description": request.body.des,
            "duration": request.body.minu,
            "dt": d
        };
        coll.insertOne(ex, (err, doc1) => {
            if (err) throw err;
            response.send(ex);
        });
    });
});

app.get("/api/exercise/log", (request, response) => {
    mongodb.MongoClient.connect(uri, (err, dbase) => {
        if (err) throw err;
        var dbx = dbase.db(process.env.DB);
        var coll = dbx.collection(process.env.COLLECTION);
        var coll1 = dbx.collection(process.env.COLLECTION1);

        coll.find({
            "id": parseInt(request.query.userId)
        }, {
            fields: {
                _id: 0
            }
        }).toArray((err, doc) => {
            if (err) throw err;

            if (doc) {
                coll1.find({
                    "uid": request.query.userId
                }, {
                    fields: {
                        _id: 0
                    }
                }).toArray((err1, doc1) => {
                    if (err1) throw err1;
                    if (doc1) {

                        var fArr = [];
                        if (request.query.from) {
                            var ds1 = request.query.from;
                            var yyyy1 = ds1.substring(0, 4);
                            var mm1 = ds1.substring(5, 7);
                            var dd1 = ds1.substring(8, 10);
                            var dte1 = new Date(yyyy1, parseInt(mm1) - 1, dd1);
                            for (var i = 0; i < doc1.length; i++) {
                                var ds = doc1[i]["dt"];
                                var yyyy = ds.substring(0, 4);
                                var mm = ds.substring(5, 7);
                                var dd = ds.substring(8, 10);
                                var dte = new Date(yyyy, parseInt(mm) - 1, dd);
                                if (dte1 <= dte) {
                                    fArr.push(doc1[i]);
                                }
                            }
                        }
                        if (request.query.to) {
                            var ds1 = request.query.to;
                            var yyyy1 = ds1.substring(0, 4);
                            var mm1 = ds1.substring(5, 7);
                            var dd1 = ds1.substring(8, 10);
                            var dte1 = new Date(yyyy1, parseInt(mm1) - 1, dd1);
                            var tempArr = [];
                            if (request.query.from) {
                                for (var i = 0; i < fArr.length; i++) {
                                    var ds = fArr[i]["dt"];
                                    var yyyy = ds.substring(0, 4);
                                    var mm = ds.substring(5, 7);
                                    var dd = ds.substring(8, 10);
                                    var dte = new Date(yyyy, parseInt(mm) - 1, dd);
                                    if (dte1 < dte) {
                                        //fArr.pop(doc1[i]);
                                        //console.log("pop");
                                        //array.splice(index, 1);
                                        tempArr.push(i);
                                        console.log(dte1 + "<=" + dte);
                                    }
                                }
                                for (var i = 0; i < tempArr.length; i++) {
                                    fArr.splice(tempArr[i],1);
                                }
                            } else {
                                for (var i = 0; i < doc1.length; i++) {
                                    var ds = doc1[i]["dt"];
                                    var yyyy = ds.substring(0, 4);
                                    var mm = ds.substring(5, 7);
                                    var dd = ds.substring(8, 10);
                                    var dte = new Date(yyyy, parseInt(mm) - 1, dd);
                                    if (dte1 >= dte) {
                                        fArr.push(doc1[i]);
                                    }
                                }
                            }
                        }
                      if (!request.query.from && !request.query.to) {
                            fArr = doc1;
                            console.log("here");
                        }
                        if (request.query.limit) {
                            fArr = fArr.slice(0, request.query.limit);
                        }
                        if (fArr.length == 0 && request.query.from == "" || request.query.to == "" || request.query.limit == "") {
                            fArr = doc1;
                            console.log("fArr is empty");
                        }
                        response.send({
                            "user": doc,
                            "exercise": fArr
                        });
                    } else {
                        response.send({
                            "error": "No data is available for this user."
                        });
                    }
                });
            } else {
                response.send({
                    "error": "user does not exist."
                });
            }
        });
    });
});

// listen for requests :)
var listener = app.listen(3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});