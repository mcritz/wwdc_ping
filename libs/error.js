var notifyOnFail = function(e){
	// XXTODOXX: more robust error handling
	if (!e.message){
		console.log('EPIC FAIL!');
		return;
	}
	switch (e.message) {
		case 'getaddrinfo ENOTFOUND' :
			console.log(e.message + '\n\n I can’t find the url.');
		default :
			console.log('The worst thing happened:');
			console.log(e.message);
			return('typical fail');
	}
}

module.exports.notifyOnFail = notifyOnFail;
