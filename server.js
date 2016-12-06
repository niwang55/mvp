var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

mongoose.connect('mongodb://localhost/mvp');

var Name = mongoose.model('Name', {
  originalName: String,
  generatedName: String,
  imageUrl: String,
  albumTitle: String
});

app.use(express.static(path.join(__dirname, 'client')));

app.get('/names', function(req, res) {
  Name.find({}, function(err, names) {
    if (err) { res.send(err); }
    res.json(names);
  });
});

app.post('/names', function(req, res) {
  Name.findOne({originalName: req.body.originalName}, function(err, name) {
    if (!name) {
      Name.create({
        originalName: req.body.originalName,
        generatedName: req.body.generatedName
      });
    }
  });
});

app.post('/album', function(req, res) {
  Name.findOne({originalName: req.body.name}, function(err, name) {
    if (!name.imageUrl) {
      name.imageUrl = req.body.url;
      name.albumTitle = req.body.quote;
      name.save(function(err) {
        if (err) {
          throw err;
        }
      });
    }
  });
});

app.listen(3000, function() {
  console.log('Now listening on port 3000');
});

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, './client/index.html'));
// });