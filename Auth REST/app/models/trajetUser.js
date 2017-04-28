//notre bd 
//documentation https://www.npmjs.com/package/mongoose
var mongoose		= require('mongoose');
//pour creer un schema
var Schema			= mongoose.Schema;



//modele du schema mongoose pour creer la bd
var trajetUserSchema = new Schema({
	id:{
		type: String,
		require: true,
		unique: true
	},
	idUser:{
        type: String,
        require: true
    },
    lieu: {
        type: String,
<<<<<<< HEAD
        require: true
=======
        require: true,
>>>>>>> 36560b133cd4d967d6e2f4fe709aefc2547fd3bd
    },
    nombrePlace:{
        type: Number,
        require: true
    },
    dateTrajet:{
        type: Date,
        require: true
    }
});





<<<<<<< HEAD
module.exports = mongoose.model('TrajetUser', trajetUserSchema);
=======
module.exports = mongoose.model('TrajetUser', trajetUserSchema);
>>>>>>> 36560b133cd4d967d6e2f4fe709aefc2547fd3bd
