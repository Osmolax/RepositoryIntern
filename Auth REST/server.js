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
var trajetUser			= require('./app/models/trajetUser');
var trajetDemande			= require('./app/models/trajetDemande');
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


app.post('/api/createUserTrajet', function(req, res){

    if(!req.body.trajet){
        var UserTrajet = new trajetUser({ idUser: req.body.idUser, lieu: req.body.lieu, dateTrajet: req.body.dateTrajet, nombrePlace: req.body.nombrePlace});
        UserTrajet.save(function(err){
            if (err) {
                return res.json( {succes: false, message: 'Erreur creation trajetUser'});

            }
            else{
                return res.json({ succes: true, message: 'trajetUser creer avec succes'});
                console.log('all is ok');
            }

        });
    }
})

app.post('/api/createUserDemand', function(req, res){

    if(!req.body.trajet){
        var trajetDemand = new trajetDemande({ idUser: req.body.idUser, lieu: req.body.lieu, dateTrajet: req.body.dateTrajet, nombrePlace: req.body.nombrePlace});
        trajetDemand.save(function(err){
            if (err) {
                return res.json( {succes: false, message: 'Erreur création trajetDemande'});

            }
            else{
                return res.json({ succes: true, message: 'trajetDemande créée avec succes'});
                console.log('all is ok');
            }

        });
    }
})


app.get('/api/member', passport.authenticate('jwt', {session: false}), function(req,res){
    res.json({message:'succes authentication', user: req.user});
});


app.get('/api/allOffre', function(req, res){
    trajetUser.find({}, function(err, trajects){
        if (err) {  throw err; }
        else{
            //res.render('trajetList', trajects);
            console.log('liste of all trajects', trajects.length);
            res.json(trajects);
        }
    });
})

app.get('/api/allDemand', function(req, res){
    trajetDemande.find({}, function(err, demands){
        if (err) {  throw err; }
        else{
            //res.render('trajetList', trajects);
            console.log('liste of all demands', demands.length);
            res.json(demands);
        }
    });
})



//demarrer le serv avec port specifier
app.listen(port);
console.log('The server is running');