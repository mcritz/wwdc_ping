var https = require('https'); // WWDC site is https. Besides… http://www.codinghorror.com/blog/2012/02/should-all-web-traffic-be-encrypted.html
var urlToPing = 'https://developer.apple.com/WWDC/'; // WWDC site
var searchRegExp = new RegExp('wwdc2013-june-11-15.jpg'); // old WWDC image
var interval = 1000; // milliseconds. WARNING!! DO NOT BE A JACKASS. KEEP SANE LIMITS!
var messageSent = false; // Assuming we're always running, send message just once.

var mail 	= require('./libs/mail');
var error 	= require('./libs/error');

var notifyOnMatch = function(str){
	var messageText = 'WWDC ticket sales are LIVE!';
	var sendMessage = new mail.sendMessage(messageText);
}

var completeMission = function(){
	throw('All done!'); // XXTODOXX: graceful process termination?
}

var getUrl = function(){
	// fetch
	https.get(urlToPing, function(res) {
		var output = '';

		console.log('Got response: ' + res.statusCode);

		res.on('data', function (chunk) {
	        output += chunk;
		});

		res.on('end', function(){
			// Check if site contains the old stuff
			if (!searchRegExp.exec(output) && !messageSent) {
				notifyOnMatch(output);
				messageSent = true;
				completeMission();
			}
		});
	}).on('error', function(e) {
		var notifyOnFail = new error.notifyOnFail(e);
	});
}

// run on launch…
getUrl();
// …then repeat at interval
setInterval(getUrl, interval);
