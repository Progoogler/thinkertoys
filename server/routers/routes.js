var express         =   require('express'),
    router          =   express.Router(),
    mongoose        =   require('mongoose'), 
    mongoOp         =   require('../models/thinkertoy'),
    mongoUri        =   'mongodb://heroku_grfhfzjk:uh7atehtor0iai4p6ki8h4fgt6@ds157499.mlab.com:57499/heroku_grfhfzjk';


    // Local server access for debugging/testing:    
    // 'mongodb://localhost:27017/ThinkerToysDB'; 

mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function() {
  throw new Error('unable to connect to database at ' + mongoUri);
});


router.route('/thinkertoys')
  .get(function(req, res) {
    var response = {};
    mongoOp.find({}, function(err, data) {
      if (err) {
        response = { 'error' : true, 'message' : 'Error fetching data' };
      } else {
        response = { 'error' : false, 'message' : data };
      } console.log('get response ', data);
      res.json(response);
    });
  })
  .post(function(req, res) {
    var response = {};
    mongoOp.findOne({ 'fileName' : req.body.fileName }, function(err, data) {
      if (err) {
        response = { 'error' : true, 'message' : 'Error fetching data' };
        res.json(response);
      } else if (data === null) { 
        var db = new mongoOp;
        db.fileName = req.body.fileName;
        db.name = req.body.name;
        db.text = req.body.text;
        db.save(function(err) {
          if (err) { 
            response = { "error" : true, "message" : "Error fetching data" };
          } else {
            response = { "error" : false, "message" : "Data added as new post" }; 
          } 
          res.json(response);      
        });
      } else {
        if (req.body.text !== undefined) {
          data.text = req.body.text;
        }
        data.save(function(err) {
          if (err) {
            response = { "error" : true, "message" : "Error updating data" };
          } else {
            response = { "error" : false, "message" : "Data is updated for " + req.body.fileName };
          }
        res.json(response);
        });
      }
    });
  })
  .delete(function(req, res) {
    var response = {};
    mongoOp.find({}, function(err, data) {
      // Be careful. This command deletes all the contents of the database.
      if (err) {
        response = { "error" : true, "message" : "Error fetching data" };
      } else {
        console.log("This database has been deleted: ", data);
        response = { "error" : false, "message" : "This database has been deleted" + data };
        for (var i = 0; i < data.length; i++) data[i].remove();
        
      }
      res.json(response);
    });
  });

module.exports = router;