var notifyOnMatch = function(str, timer){
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
			messageSent = false;
			pollUrl();
		}else{
			console.log("Message sent: " + response.message);
			completeMission();
	   }
	});
}

module.exports = notifyOnMatch;
