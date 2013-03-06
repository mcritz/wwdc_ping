var https = require('https'); // WWDC site is https. Besides… http://www.codinghorror.com/blog/2012/02/should-all-web-traffic-be-encrypted.html
var urlToPing = 'https://developer.apple.com/WWDC/'; // WWDC site
var searchRegExp = new RegExp('wwdc2012-june-11-15.jpg'); // old WWDC image
var interval = 1500; // * 30 milliseconds. WARNING!! DO NOT BE A JACKASS. KEEP SANE LIMITS!
var timerID;
var messageSent = false; // Assuming we're always running, send message just once.
var messageSubject = 'Time to check out WWDC 2013!';
var messageText = urlToPing + '\n\n\nThere has been a change detected to Apple WWDC site.';

var error 	= require('./libs/error');

// XXTODOXX: single responsibility getUrl. Need to move this into a new require.
var notifyOnMatch = function(str){
	console.log('change detected!');
	stopPolling();

	var nodemailer 		= require('./node_modules/nodemailer');
	var mailCredentials	= require('./credentials');

	var smtpTransport = nodemailer.createTransport("SMTP",{
	   service: "Gmail",
	   auth: {
	       user: mailCredentials.user,
	       pass: mailCredentials.pass
	   }
	});
	smtpTransport.sendMail({
		from: mailCredentials.sender,
		to: mailCredentials.recipients,
		subject: messageSubject,
		text: messageText // plaintext
	}, function(error, response){
		if(error){
			console.log('Mail error: ');
			console.log(error);

			// reset polling
			messageSent = false;
			pollUrl();
		} else {
			console.log("Message sent: " + response.message);
			completeMission();
	   	}
	});
}

var completeMission = function(){
	throw('All done!'); // XXTODOXX: graceful process termination?
}

var getUrl = function(){
	// fetch
	https.get(urlToPing, function(res) {
		var output = '';

		// console.log('Got response: ' + res.statusCode);
		switch (res.responseCode) {
			case '401' :
				console.log('401: UNAUTHORIZED!'); // XXTODOXX: notify admin
			case '403' :
				console.log('403: FORBIDDEN!'); // XXTODOXX: notify admin
			case '404' :
				console.log('404: Url not found!'); // XXTODOXX: notify admin
			case '408' :
				console.log('408: Request Timeout!'); // XXTODOXX: notify everyone
			default :
				console.log('Got response: ' + res.statusCode);
		}

		res.on('data', function (chunk) {
	        output += chunk;
		});

		res.on('end', function(){
			// Check if site contains the old stuff
			if (!searchRegExp.exec(output) && !messageSent) {
				notifyOnMatch(output);
				messageSent = true;
				output = '';
			}
		});
	}).on('error', function(e) {
		var notifyOnFail = new error.notifyOnFail(e);
	});
}

var pollUrl = function(timerToset){
	timerToset = setInterval(function(){
		getUrl()
	}, interval);
}

var stopPolling = function(timerToUnset){
	clearInterval(timerToUnset);
}

var init = function(){
	// check first…
	getUrl(timerID);
	// …then repeat with interval
	pollUrl(timerID);

	// start a web server
	var web = require('./libs/web');
	web.server();
}

init();

