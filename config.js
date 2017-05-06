function _development(){
	return{
		"mongodb": "mongodb://localhost/testing",
		"port": 8088
	}
}

function _production(){
	if(!process.env.NODE_PASSWORD){
		throw new Error("MISSING PASSWORD");
	}
	return {
		"mongodb": "mongodb://localhost/production",
		"password": process.env.NODE_PASSWORD,
		"port": 9000
	}
}

module.exports = function(){
	switch(process.env.NODE_ENV){
		case 'development':
			return _development();
		case 'production':
			return _production();
		default:
			return _development();
	}
}