var notifyOnFail = function(e){
	// XXTODOXX: more robust error handling
	if (e){
		console.log('Got error: ' + e.message);
	} else {
		console.log('The worst thing happened.');
		return('epicFail');
	}
}

module.exports.notifyOnFail = notifyOnFail;
