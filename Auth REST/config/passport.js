//utiliser la stategie de jwt 
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

//schema user et functions
var User = require('../app/models/user');
//use secret
var conf = require('../config/database');
//
//var passport = require('passport');

module.exports = function(passport){
	console.log('in the export module passport');
	var opts = {};
	//le JWT doit respecter le pattern 'JWT <token>' 
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	//secretOrKey est une chaîne ou un tampon contenant le secret (symétrique) ou clé publique PEM codé (asymétrique) pour la vérification de la signature du jeton REQUIS.
	opts.secretOrKey = conf.secret;
	//utiliser le passport avec la strategie jwt-strategy avec options
	// jwt_payload est un littéral d'objet contenant la charge utile JWT décodé.
	// done est une erreur de passeport premier rappel accepter des arguments fait (erreur, utilisateur, info)
	passport.use(new JwtStrategy(opts, function(jwt_payload, done){
		//console.log("in the passport use");
		User.findOne({id: jwt_payload.id}, function(err, user){
			if (err) { return done(err, false); console.log('user found'); }
			if (user) { done(null, user); console.log('user not found'); }
			else{ done(null,false); console.log('erreur'); }
		});
	}));
};