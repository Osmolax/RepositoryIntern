//notre bd 
//documentation https://www.npmjs.com/package/mongoose
var mongoose		= require('mongoose');
//pour creer un schema
var Schema			= mongoose.Schema;
//pour crypter le mdp
var bcrypt			= require('bcrypt');


//modele du schema mongoose pour creer la bd
var UserSchema = new Schema({
	id:{
		type: String,
		require: true,
		unique: true
	},
	login: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
    email: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    BU: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    vehicule: {
        type: String
    },
    matricule: {
        type: String
    },
    nombre_place: {
        type: Number
    },
    nom:{
        type: String,
        required: true
    },
    prenom:{
        type: String,
        required: true
    },
    dateNaissance:{
        type: String,
        required: true
    },
    numCIN:{
        type: String,
        required: true
    },
    sexe:{
        type: String,
        required: true
    },
    photo:{
        type: String
    }


});

//creer un utilisateur avec un mdp hashé 
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password') || user.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) { return next(err); }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) { return next(err); }
                user.password = hash;
                next();
            });
        });
    } else if(!user.isModified('password')){
        return next();
    }
});






//methode pour comparer le password
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
 
module.exports = mongoose.model('User', UserSchema);
