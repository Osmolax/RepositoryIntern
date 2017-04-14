//dependencies
//framework standard pour le devloppement de serveur en Noje.Js
var express 			= require('express');
var app 				= express();
//body-parser morceau de middleware express pour lire les données HTTP POST
var bodyParser 			= require('body-parser');
//Concise sortie de couleur selon l' état de réponse pour l' utilisation de développement. Le :status jeton est de couleur rouge pour les codes d'erreur du serveur, jaune pour les codes d'erreur client, cyan pour les codes de redirection, et incolores pour tous les autres codes.
var morgan 				= require('morgan');
//notre BD
var mongoose			= require('mongoose');
//Passport est l' authentification middleware pour Node.Js
var passport			= require('passport');
var config				= require('./config/database');
var User				= require('./app/models/user');
var trajets				= require('./app/models/trajets');
//num de port
var port				= process.env.PORT || 8080;
//Json Web Token
var jwt					= require('jwt-simple');



//https://github.com/expressjs/body-parser
//app.use(bodyParser.urlencoded( { extended: false; } ));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





//log to console
app.use(morgan('dev'));

//Utiliser le package passeport dans notre appli
app.use(passport.initialize());




//webservice REST en GET pour tester la connectivite du serv 
app.get('/api/index', function(req,res){
	res.send('Hello, welcome to http://localhost:'+port+'/index OK');
});


//se connecter a la database
mongoose.connect(config.database);

//Bring in defined Passport Strategy
require('./config/passport')(passport);
//require('./config/passport');
//creer les routes
//var route = express.Router();

app.get('/api/test', function(req, res){
	res.send('hello from the route /test');
	console.log('I am gonna kill my self');
});

//ajouter l'utilisateur a la base de donnees avec ws REST en POST
app.post('/api/createUser', function(req, res){
	if (req.body.login==null || req.body.password==null) {
		//si quelque chose manque on envoie un message d'erreur 
		res.json({succes: false, message: 'Veuillez entrer le login et le mot de passe'});
	}
	else{
		//sinon on enregistre le user
		var newUser = new User({ login: req.body.login, password: req.body.password, email: req.body.email, tel: req.body.tel, address: req.body.address, BU: req.body.BU, job: req.body.job });
		newUser.save(function(err){
			if (err) { 
				return res.json({ succes: false, message: 'Erreur login deja pris'});
				 }
			else{ return res.json({ succes: true, message: 'Utilisateur creer avec succes'}); }
		});
	}
});

//comparer login et password et generer token
app.post('/api/authentication', function(req,res){
	User.findOne({login: req.body.login}, function(err, user){
		if (err) { throw err; }
		if (!user) { return res.send({ succes: false, message: 'User not found'});}
		else{ user.comparePassword(req.body.password, function(err, isMatch){
			if (isMatch && !err) { var token = jwt.encode(user, config.secret);
				res.json({succes: true, token: 'JWT '+token, message: 'successfully authenticated'}); 
			}
			else{
				return res.send({succes: false, message:'Wrong password'});
			}
		});}
	});
});

app.get('/api/listeTrajet', function(req, res){
	//res.send(JSON.stringify(trajets.find()));
	//res.send(JSON.stringify(trajets.find()));
	var trajet;
	var trajectsFromDb = db.trajets.find();
	/*trajectsFromDb.forEach(function(race){
		console.log(race);
	});*/
	res.send('ok');
	console.log(trajectsFromDb);
});

app.get('/api/member', passport.authenticate('jwt', {session: false}), function(req,res){
	res.json({message:'succes authentication', user: req.user});
});

//demarrer le serv avec port specifier
app.listen(port);
console.log('The server is running');