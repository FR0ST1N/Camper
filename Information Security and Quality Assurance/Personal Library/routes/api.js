/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;
const coll = process.env.COLLECTION;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        expect(err, 'error').to.not.exist;
        var collection = db.collection(coll);
        collection.find().toArray(function(err, result) {
          expect(err, 'error').to.not.exist;
          expect(result).to.exist;
          expect(result).to.be.a('array');
          for(var i=0;i<result.length;i++) {
            result[i].commentcount = result[i].comments.length;
            delete result[i].comments;
          }
          res.json(result);
        });
      });
    })
    .post(function (req, res){
      var title = req.body.title;
      if(!title) {
        res.send('missing title');
      } else {
        expect(title, 'posted title').to.be.a('string');
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
          expect(err, 'error').to.not.exist;
          var collection = db.collection(coll);
          var doc = {title:title, comments:[]};
          collection.insert(doc, {w:1}, function(err, result) {
            expect(err, 'insert error').to.not.exist;
            res.json(result.ops[0]);
          });
        });
      }
    })
    .delete(function(req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        expect(err, 'error').to.not.exist;
        var collection = db.collection(coll);
        collection.remove();
        res.send("Delete successful!");
      });
    });
    
  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      var oid = new ObjectId(bookid);
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        expect(err, 'error').to.not.exist;
        var collection = db.collection(coll);
        collection.find({_id:oid}).toArray(function(err, result) {
          expect(err, 'error').to.not.exist;
          if(result.length === 0) {
            res.send('Book does not exist');
          } else {
            res.json(result[0]);
          }
        });
      });
    })
    .post(function(req, res){
      var bookid = req.params.id;
      var oid = new ObjectId(bookid);
      var comment = req.body.comment;
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        expect(err, 'error').to.not.exist;
        var collection = db.collection(coll);
        collection.findAndModify(
          {_id: oid},
          {},
          {$push: { comments: comment }},
          {new: true, upsert: false},
          function(err, result){
            expect(err, 'error').to.not.exist;
            res.json(result.value);
          });
      });
    })
    .delete(function(req, res){
      var bookid = req.params.id;
      var oid = new ObjectId(bookid);
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
        expect(err, 'database error').to.not.exist;
        var collection = db.collection(coll);
        collection.findOneAndDelete({_id:oid}, function(err, result) {
          expect(err, 'error').to.not.exist;
          expect(result, 'error').to.exist;
          res.send("Delete successful!");
        });
      });
    });
  
};
