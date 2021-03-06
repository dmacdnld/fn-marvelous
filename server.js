var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname + '/public/' });
});
app.use('/', express.static(__dirname + '/public/'));
app.use('/js', express.static(__dirname + '/public/js/dist'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});