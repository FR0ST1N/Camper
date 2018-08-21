/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const coll = process.env.COLLECTION;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var query = req.query;
      if (query._id) { query._id = new ObjectId(query._id)}
      if (query.open) { query.open = String(query.open) == "true" }
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        var collection = db.collection(coll);
        collection.find(query).toArray(function(err,docs){res.json(docs)});
      });
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var newIssue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || ''
      };
      if(!newIssue.issue_title || !newIssue.issue_text || !newIssue.created_by) {
        res.send('all inputs required');
      } else {
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          var collection = db.collection(coll);
          collection.insertOne(newIssue,function(err,doc){
            newIssue._id = doc.insertedId;
            res.json(newIssue);
          });
        });
      }
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var issue = req.body._id;
      delete req.body._id;
      var updates = req.body;
      for (var ele in updates) { if (!updates[ele]) { delete updates[ele] } }
      if (updates.open) { updates.open = String(updates.open) == "true" }
      if (Object.keys(updates).length === 0) {
        res.send('no updated field sent');
      } else {
        updates.updated_on = new Date();
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          var collection = db.collection(coll);
          collection.findAndModify({_id:new ObjectId(issue)},[['_id',1]],{$set: updates},{new: true},function(err,doc){
            (!err) ? res.send('successfully updated') : res.send('could not update '+issue+' '+err);
          });
        });    
      }
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var issue = req.body._id;
      console.log("Deleting: " + issue);
      if (!issue) {
        res.send('_id error');
      } else {
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
          var collection = db.collection(coll);
          collection.findAndRemove({_id:new ObjectId(issue)},function(err,doc){
            (!err) ? res.send('deleted '+issue) : res.send('could not delete '+issue+' '+err);
          });
        });
      }
    });
    
};
