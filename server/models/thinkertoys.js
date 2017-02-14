var mongoose = require('mongoose');

var userData = new mongoose.Schema({
  name: String,
  data: String
})

module.exports = mongoose.model('Thinkertoys', userData);