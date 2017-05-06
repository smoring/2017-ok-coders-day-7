function _development(){
	return{
		"mongodb": "mongodb://localhost/testing",
		"secret": "123456789",
		"port": 8088
	}
}

function _production(){
	if(!process.env.NODE_JWT_SECRET){
		throw new Error("MISSING NODE_JWT_SECRET");
	}
	return {
		"mongodb": "mongodb://localhost/production",
		"secret": process.env.NODE_JWT_SECRET,
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