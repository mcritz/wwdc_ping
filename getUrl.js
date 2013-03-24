var https = require('https'); // WWDC site is https. Besides… http://www.codinghorror.com/blog/2013/02/should-all-web-traffic-be-encrypted.html
var urlToPing = 'https://developer.apple.com/WWDC/'; // WWDC site
var get_options = {
	host: urlToPing
 	, headers: {
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/536.26.17 (KHTML, like Gecko) Version/6.0.2 Safari/536.26.17'
	}
}
var searchRegExp = new RegExp('wwdc2012-june-11-15.jpg'); // old WWDC image
var interval = 77 * 1000; // * 30 milliseconds. WARNING!! DO NOT BE A JACKASS. KEEP SANE LIMITS!
var timerID;
var messageSent = false; // Assuming we're always running, send message just once.
var messageSubject = 'Time to check out WWDC 2013!';
var adminSubject = 'Problem with WWDC ping'
var messageText = urlToPing + '\n\n\nThere has been a change detected to Apple WWDC site.';
var mailCredentials	= require('./credentials');

var error 	= require('./libs/error');

// XXTODOXX: single responsibility getUrl. Need to move this into a new require.
var sendUserMail = function(htmlOutput,destination,mailSubject,message){
	stopPolling();

	var nodemailer 		= require('./node_modules/nodemailer');

	var smtpTransport = nodemailer.createTransport("SMTP",{
	   service: "Gmail",
	   auth: {
	       user: mailCredentials.user,
	       pass: mailCredentials.pass
	   }
	});
	smtpTransport.sendMail({
		from: mailCredentials.sender,
		to: destination,
		subject: mailSubject,
		text: message // plaintext
	}, function(error, response){
		if(error){
			console.log('Mail error: ');
			console.log(error);

			// reset polling
			messageSent = false;
			pollUrl();
		} else {
			console.log("Message sent: " + response.message);
			completeMission(destination);
	   	}
	});
}

var completeMission = function(user){
	if (user != 'mcritz@mac.com'){
		throw('All done!'); // XXTODOXX: graceful process termination?
	}
} 

var getUrl = function(){
	// fetch
	https.get(urlToPing, function(res) {
		var output = '';
		
		var d = new Date();
		var logTime = d + ' :: ';
		var responsecode = res.statusCode.toString();
		switch (responsecode) {
			case '301' :
				var message = logTime + '301: Redirect!';
				console.log(message);
				sendUserMail(output,mailCredentials.admin,adminSubject,message);
				break;
			case '401' :
				var message = logTime + '401: UNAUTHORIZED!';
				console.log(message);
				sendUserMail(output,mailCredentials.admin,adminSubject,message);
				break;
			case '403' :
				var message = logTime + '403: FORBIDDEN!';
				console.log(message);
				sendUserMail(output,mailCredentials.admin,adminSubject,message);
				break;
			case '404' :
				var message = logTime + 'Hello. I think Apple’s WWDC site is currently down. Just felt like sharing.';
				sendUserMail(output,mailCredentials.recipients,'WWDC site offline',message);
				break;
			case '408' :
				var message = logTime + 'Hello. I think Apple’s WWDC site is currently offline. Just felt like sharing.';
				sendUserMail(output,mailCredentials.recipients,'WWDC site offline',message);
				break;
			default :
				console.log(logTime + 'Got response: ' + res.statusCode);
		}

		res.on('data', function (chunk) {
	        output += chunk;
		});

		res.on('end', function(){
			if (!searchRegExp.exec(output) && !messageSent) {
				// Site changed. Send message!
				console.log('change detected!' + Date+now());
				sendUserMail(output,mailCredentials.recipients,messageSubject,messageText);
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

