/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var Thread = require('../controllers/thread.js');
var Reply = require('../controllers/reply.js');

module.exports = function (app) {
  var thread = new Thread();
  var reply = new Reply();
  
  app.route('/api/threads/:board')
  .get(thread.threadList)
  .post(thread.newThread)
  .put(thread.reportThread)
  .delete(thread.deleteThread);
    
  app.route('/api/replies/:board')
  .get(reply.replyList)
  .post(reply.newReply)
  .put(reply.reportReply)
  .delete(reply.deleteReply);

};
