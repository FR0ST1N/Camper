var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;
var boardCollection = process.env.COLLECTION;
    
function Thread() {

  this.threadList = function(req, res) {
    //var board = req.params.board;
    mongo.connect(url,function(err,db) {
      var collection = db.collection(boardCollection);
      collection.find(
        {board: req.params.board},
        {
          reported: 0,
          delete_password: 0,
          "replies.delete_password": 0,
          "replies.reported": 0
        })
      .sort({bumped_on: -1})
      .limit(10)
      .toArray(function(err,docs){
        docs.forEach(function(doc){
          doc.replycount = doc.replies.length;
          if(doc.replies.length > 3) {
            doc.replies = doc.replies.slice(-3);
          }
        });
        res.json(docs);
      });
    });
  };
  
  this.newThread = function(req, res) {
    //var board = req.params.board;
    var thread = {
      board: req.params.board,
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    };
    mongo.connect(url,function(err,db) {
      var collection = db.collection(boardCollection);
      collection.insert(thread, function(){
        res.redirect('/b/'+req.params.board+'/');
      });
    });
  };
  
  //reported_id name
  this.reportThread = function(req, res) {
    //var board = req.params.board;
    mongo.connect(url,function(err,db) {
      var collection = db.collection(boardCollection);
      collection.findAndModify(
        {_id: new ObjectId(req.body.report_id)},
        [],
        {$set: {reported: true}},
        function(err, doc) {});
    });
    res.send('reported');
  };
  
  //check doc return to return right res
  this.deleteThread = function(req, res) {
    //var board = req.params.board;
    console.log(req.body.thread_id);
    mongo.connect(url,function(err,db) {
      var collection = db.collection(boardCollection);
      collection.findAndModify(
        {
          _id: new ObjectId(req.body.thread_id),
          delete_password: req.body.delete_password
        },
        [],
        {},
        {remove: true, new: false},
        function(err, doc){
          if (doc.value === null) {
            res.send('incorrect password');
          } else {
            res.send('success');
          }
        });
        
    });
  };
  
}

module.exports = Thread;