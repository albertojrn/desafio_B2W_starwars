var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planetaSchema = new Schema(
    {
        nome: String,
        clima: String,
        terreno: String,
        aparicoes: Number
    }
);

module.exports = mongoose.model('Planeta', planetaSchema);