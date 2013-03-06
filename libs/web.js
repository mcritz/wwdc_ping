var http = require('http');
var page = '<!doctype html><html><head><title>WWDC Ping</title></head><body><h1>Hello World!</h1></body></html>';

var server = function(){

	http.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(page);
	}).listen(8080, '127.0.0.1');

	console.log('Server running at http://127.0.0.1:8080/');
}

module.exports.server = server;
