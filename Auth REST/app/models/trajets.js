//notre bd 
//documentation https://www.npmjs.com/package/mongoose
var mongoose		= require('mongoose');
//pour creer un schema
var Schema			= mongoose.Schema;



//modele du schema mongoose pour creer la bd
var trajetsSchema = new Schema({
	id:{
		type: String,
		require: true,
		unique: true
	},
	location1: {
		type: String,
		required: true,
		unique: true,
	},
	location2: {
		type: String,
        required: true,
		required: true,
	},
    
});



module.exports = mongoose.model('Trajet', trajetsSchema);
