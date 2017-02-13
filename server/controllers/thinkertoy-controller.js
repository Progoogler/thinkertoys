var Thinkertoy = require('../models/thinkertoy');

module.exports.create = function(req, res) {
  var thinkertoy = new Thinkertoy(req.body);
  thinkertoy.save(function(err, result) {
    res.json(result);
  });
};

module.exports.list = function(req, res) {
  Thinkertoy.find({}, function(err, results) {
    res.json(results);
  });
}