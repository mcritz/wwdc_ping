var nodemailer 		= require('../node_modules/nodemailer');
var mailCredentials	= require('../credentials.js');

var sendMessage = function(str) {
	user = mailCredentials.user;
	pass = mailCredentials.pass;
}

module.exports.sendMessage = sendMessage;
