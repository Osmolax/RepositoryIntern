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
        require: true,
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





module.exports = mongoose.model('TrajetUser', trajetUserSchema);
