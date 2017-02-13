var express               = require('express'),
    app                   = express(),
    bodyParser            = require('body-parser'),
    mongoose              = require('mongoose'),
    thinkertoy-controller = require('./server/controllers/thinkertoy-controller');
    port                  = 3000;


mongoose.connect('mongodb://localhost:27017/ThinkerToys');

app.use(bodyParser());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));

// REST API
app.get('/api/thinkertoys', thinkertoyController.list);
app.post('/api/thinkertoys', thinkertoyController.create);

app.listen(port, function() {
  console.log('Serving running on port: ' + port);
});