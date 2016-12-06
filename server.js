var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://localhost/mvp');

var Name = mongoose.model('Name', {
  originalName: String,
  generatedname: String,
  imageUrl: String,
  albumTitle: String
});

app.use(express.static(path.join(__dirname, 'client')));

app.get('/api/test', function(req, res) {
  Name.create({
    originalName: 'test',
    generatedname: 'test',
    imageUrl: 'test',
    albumTitle: 'test'
  });
});

app.listen(3000, function() {
  console.log('Now listening on port 3000');
});

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, './client/index.html'));
// });