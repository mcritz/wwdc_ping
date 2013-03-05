var https = require('https'); // WWDC site is https. Besides… http://www.codinghorror.com/blog/2012/02/should-all-web-traffic-be-encrypted.html
var urlToPing = 'https://developer.apple.com/WWDC/'; // WWDC site
var searchRegExp = new RegExp('wwdc2012-june-11-15.jpg'); // old WWDC image
var interval = 30 * 1000; // milliseconds

notifyOnMatch = function(str){
	// XXTODOXX: set up email feature.
	console.log(str);
	console.log('Matched!');
}

notifyOnFail = function(e){
	// XXTODOXX: more robust error handling
	console.log('Got error: ' + e.message);
}

getUrl = function(){
	// fetch
	https.get(urlToPing, function(res) {
		var output = '';

		console.log('Got response: ' + res.statusCode);

		res.on('data', function (chunk) {
	        output += chunk;
		});

		res.on('end', function(){
			// Check if site contains the old stuff
			if (!searchRegExp.exec(output)) {
				notifyOnMatch(output);
			}
		});
	}).on('error', function(e) {
		notifyOnFail(e);
	});
}

// run on launch…
getUrl();
// then repeat at interval
setInterval(getUrl, interval);
