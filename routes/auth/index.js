var Auth = require('../../models/auth');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../../config.js')();

const saltRounds = 2;

var getToken = function(user){
	var date = ( Date.now() / 1000 );
	var exp = date + (60 * 120);
	return jwt.sign({
		user: user._id,
		iat: date,
		exp: exp
	}, config.secret);
}

exports.create = function(req, res, next){
	var auth = new Auth();
	var user = req.body.username;
	var pass = req.body.password;

	if(!user || !pass){
		res.send(404, "Username or password missing");
		return next();
	}

	bcrypt.hash(pass, saltRounds, function(err,hash){
		if(err){
			console.log(err);
			res.send(404);
		} else {
			auth.username = user;
			auth.password = hash;
			auth.date = new Date();
			auth.is_active = true

			auth.save(function(err,data){
				if(err){
					console.log("Error saving to db: "+ err);
					res.send(404,"Error with database");
				} else {
					res.json(201, {status: "success"});
				}
			});
			return next();
		}
	});
};	

exports.read = function(req, res, next){
	var user = req.body.username;
	var pass = req.body.password;

	if(!user || !pass){
		res.send(404, "Username or password missing");
		return next();
	}
	
	Auth.findOne({username: user, is_active: true}).exec(function(err,data){
		if(!data) { 
			res.json(400,{status:"failed", reason: "Invalid user account"})
			return next();
		}
		
		bcrypt.compare(pass, data.password, function(err, status){
			if(status === false){
				res.json(400,{status: "failed", reason: "Invalid Password"});
				return next();
			}
			res.json(200,{status:"success", token: getToken(data)});
			return next();
		});
	});
}

exports.verify = function(req, res, next){
	var token = req.header('authorization');

	if(!token){
		console.log("no authorization header value");
		res.json(404, {status:"failed",reason:"user needs to login"});
	} else {

		jwt.verify(token, config.secret, function(err,decoded){
			if(err){
				console.log(err);
				res.json(404, {status:"failed",reason:"JWT is not valid"});
			} else {
				Auth.findOne({_id: decoded.user, is_active:true}).exec(function(err2,data){
					if(err2){
						console.log(err2);
						res.json(404, {status:"failed",reason:"Not a valid user"});
					} else {
						return next();
					}
				});
			}
		});
	}
}






