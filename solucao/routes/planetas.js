var express = require('express');
var router = express.Router();
var axios = require('axios');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var planetaModel = require('../models/planetamodel');

/* POST planetas. */
router.post('/planetas', urlEncodedParser, function(req, res) {
    // Cria novo planeta a partir do modelo
    var planeta = new planetaModel({
        nome: req.body.nome,
        clima: req.body.clima,
        terreno: req.body.terreno,
        aparicoes: req.body.aparicoes
    });
    // Verifica se os 3 campos foram preenchidos
    if(!(validar(planeta.nome, planeta.clima, planeta.terreno))){
        res.json({ message: "Os 3 campos são obrigatórios." });
    }
    /* Verifica se o planeta com o mesmo nome existe no banco de dados
     Se não existir, salva um novo registro */
    else{
        planetaModel.find({'nome': planeta.nome}, function(erro, planetas){
            if (planetas.length > 0){
                res.json( {message: "O planeta já existe no banco de dados."} );
            }
            else{
                axios.get('https://swapi.co/api/planets/?search=' + planeta.nome).then(function(response){
                    if (response.data.count > 0){
                        /* A API faz a busca por apenas uma parte do nome
                           Por exemplo, se colocar Tatoo, ela retorna o planeta
                           Tatooine
                           Com isso, vamos verificar se os nomes são exatamente iguais */
                        var encontrou = false;
                        for (var i=0; i<response.data.count; i++){
                            if (response.data.results[i].name == planeta.nome){
                                planeta.aparicoes = response.data.results[i].films.length;
                                encontrou = true;
                                break;
                            }
                        }
                        if (!encontrou) planeta.aparicoes = 0;
                    }
                    else{
                        planeta.aparicoes = 0;
                    }
                    planeta.save(function(erro, planeta){
                        if(erro) res.send(erro);
                        else res.json({message: 'Planeta adicionado com sucesso!', planeta});
                    });
                });
            }
        });
    }
});

/* GET planetas -- todos ou por nome*/
router.get('/planetas', function(req, res) {
    // Checa se a query nome foi passada na url
    if(req.query.nome){
        planetaModel.find({'nome': req.query.nome}, function(erro, planetas){
            if (erro) res.send(erro);
            else res.json(planetas);
        });
    }
    // Caso contrário retorna todos os planetas
    else{
        planetaModel.find(null, null, null, function(erro, planetas){
            if (erro) res.send(erro);
            else res.json(planetas);
        });
    }
});

/* GET planeta por id. */
router.get('/planetas/:id', function(req, res) {
    // Procura o planeta pela id
    planetaModel.findById(req.params.id, function(erro, planeta){
        if (erro) res.send(erro);
        else res.json(planeta);
    });
});

/* PUT planeta */
router.put('/planetas/:id', urlEncodedParser, function(req, res) {
    // Cria novo planeta a partir do modelo
    var planetaUpdate = {
        nome: req.body.nome,
        clima: req.body.clima,
        terreno: req.body.terreno,
        aparicoes: req.body.aparicoes
    }
    // Verifica se os 3 campos foram preenchidos
    if(!(validar(planetaUpdate.nome, planetaUpdate.clima, planetaUpdate.terreno))){
        res.json({message: "Os 3 campos são obrigatórios."});
    }
    else{
        /* Checa se o planeta já existe no banco de dados
           Neste caso o planeta que está sendo editado não deve ser checado
           pois pode-se querer mudar apenas o clima ou o terreno, então
           se o nome escolhido for igual mas o id for diferente, quer 
           dizer que o planeta já existe no bd */
        planetaModel.find({'nome': planetaUpdate.nome}, function(erro, planetas){
            var planetaExiste = false;
            for (var i=0; i<planetas.length; i++){
                if (planetas[i].nome == planetaUpdate.nome && planetas[i]._id != req.params.id){
                    planetaExiste = true;
                    break;
                }
            }
            if (planetaExiste){
                res.json({message: "O planeta já existe no banco de dados."});
            }
            else{
                planetaModel.findOneAndUpdate({_id: req.params.id}, planetaUpdate, { new: true }, function(erro, planeta){
                    if(erro) res.send(erro);
                    else res.json({ message: 'Planeta atualizado!', planeta });
                });
            }
        });
    }
});

/* DELETE planeta nome. */
router.delete('/planetas/:id', function(req, res) {
    // Deleta o planeta no banco de dados por id
    planetaModel.remove({_id: req.params.id}, function(erro, result){
        if (erro) res.send(erro);
        else res.json({message: 'Planeta excluído.', result});
    });
});

function validar(nome, clima, terreno){
    if(nome.trim() == "" || clima.trim() == "" || terreno.trim() == "") return false;
    return true;
}
    
module.exports = router;
