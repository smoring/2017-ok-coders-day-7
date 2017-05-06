var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());
var config = require('./config.js')();

const port = config.port;
var mongoose = require('mongoose');

var auth = require('./routes/auth');

mongoose.connect(config.mongodb);
var db = mongoose.connection;

db.on('error', function(msg){
	console.log('Mongoose connection error %s', msg);
});

db.once('open', function(){
	console.log('Mongoose connection established');
});

server.post('/user/add', auth.verify, auth.create);
server.post('/user/login', auth.read);

server.get('/', restify.serveStatic({
	directory: './client', 
	default: "index.html"
}));

server.get('/\/private\//', auth.verify, restify.serveStatic({
	directory: './client',
	file: "private.html"
}));

server.listen(port, function(){
	console.log("%s listening on %s", server.name, port);
});


