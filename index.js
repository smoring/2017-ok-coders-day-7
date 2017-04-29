var restify = require('restify');
var server = restify.createServer();
var port = 8088;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testing');
var db = mongoose.connection;

db.on('error', function(msg){
	console.log('Mongoose connection error %s', msg);
});

db.once('open', function(){
	console.log('Mongoose connection established');
});

server.get('/', restify.serveStatic({
	directory: './client', 
	default: "index.html"
}));

server.listen(port, function(){
	console.log("%s listening on %s", server.name, port);
});