var https = require('https');
var searchRegExp = new RegExp("wwdc2012-june-11-15.jpg");

notifyOnMatch = function(str){
	console.log(str);
	console.log('Matched!');
}

notifyOnFail = function(e){
  console.log("Got error: " + e.message);
}

getUrl = function(){
	https.get("https://developer.apple.com/WWDC/", function(res) {
		var matched = false,
			output = '';

		console.log("Got response: " + res.statusCode);

		res.on('data', function (chunk) {
	        output += chunk;
		});

		res.on('end', function(){
			if (!searchRegExp.exec(output)) {
				notifyOnMatch(output);
			}
		});
	}).on('error', function(e) {
		notifyOnFail(e);
	});
}

getUrl();

setInterval(getUrl, 30 * 1000);