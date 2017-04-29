var Auth = require('../../models/auth');
var bcrypt = require('bcrypt');
const saltRounds = 2;

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
			res.json(200,{status:"success"});
			return next();
		})
	})
}






