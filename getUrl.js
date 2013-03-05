var https = require('https'); // WWDC site is https. Besides… http://www.codinghorror.com/blog/2012/02/should-all-web-traffic-be-encrypted.html
var urlToPing = 'https://developer.apple.com/WWDC/'; // WWDC site
var searchRegExp = new RegExp('wwdc2012-june-11-15.jpg'); // old WWDC image
var interval = 30 * 1000; // milliseconds. WARNING!! DO NOT BE A JACKASS. KEEP SANE LIMITS!
var messageSent = false; // Assuming we're always running, send message just once.
var messageSubject = 'Time to check out WWDC 2013!';
var messageText = urlToPing + '\n\n\nThere has been a change detected to Apple WWDC site.';

var error 	= require('./libs/error');

var notifyOnMatch = function(str){
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
			console.log(error);
		}else{
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

		console.log('Got response: ' + res.statusCode);

		res.on('data', function (chunk) {
	        output += chunk;
		});

		res.on('end', function(){
			// Check if site contains the old stuff
			if (!searchRegExp.exec(output) && !messageSent) {
				notifyOnMatch(output);
				messageSent = true;
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
