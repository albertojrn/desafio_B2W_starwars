// Setando a variável env para test
process.env.NODE_ENV = 'test';

var planetaModel = require('../models/planetamodel');
var mongoose = require('mongoose');

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

// Início dos testes
describe('Planetas', ()=>{
    before((done)=>{
        planetaModel.remove({}, (erro)=>{
            done();
        });
    });
    
    describe('/GET planetas', ()=>{
        it('Deveria retornar todos os planetas.', (done)=>{
            chai.request(app).get('/api/planetas').end((erro, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });
    });
    
    describe('/POST planetas', ()=>{
        it('Não deveria inserir no bd um planeta sem os 3 campos preenchidos.', (done)=>{
            let planeta = {
                nome: "",
                clima: "Arid",
                terreno: "Dessert"
            }
            chai.request(app)
                .post('/api/planetas')
                .send(planeta)
                .end((erro, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Os 3 campos são obrigatórios.');
                    done();
                });
        });
        
        it('Deveria inserir no bd um planeta com nome Tatooine, clima Arid, terreno Dessert e 5 aparicoes.', (done)=>{
            let planeta = {
                nome: "Tatooine",
                clima: "Arid",
                terreno: "Dessert"
            }
            chai.request(app)
                .post('/api/planetas')
                .send(planeta)
                .end((erro, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Planeta adicionado com sucesso!');
                    res.body.should.have.property('planeta');
                    res.body.planeta.should.have.property('nome').eql('Tatooine');
                    res.body.planeta.should.have.property('clima').eql('Arid');
                    res.body.planeta.should.have.property('terreno').eql('Dessert');
                    res.body.planeta.should.have.property('aparicoes').eql(5);
                    done();
                });
        });
        
        it('Não deveria inserir novamente um planeta com nome Tatooine', (done)=>{
            let planeta = {
                nome: "Tatooine",
                clima: "Arid",
                terreno: "Dessert"
            }
            chai.request(app)
                .post('/api/planetas')
                .send(planeta)
                .end((erro, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('O planeta já existe no banco de dados.');
                    done();
                });
        });
    });
    
    describe('/GET/:id planetas', ()=>{
        it('Deveria consultar um planeta por id.', (done)=>{
            let planeta = new planetaModel({
                nome: "Yavin IV",
                clima: "Arid",
                terreno: "Dessert",
                aparicoes: 1
            });
            planeta.save((erro, planeta)=>{
                chai.request(app)
                    .get('/api/planetas/' + planeta._id)
                    .send(planeta)
                    .end((erro, res)=>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('nome').eql('Yavin IV');
                        res.body.should.have.property('clima').eql('Arid');
                        res.body.should.have.property('terreno').eql('Dessert');
                        res.body.should.have.property('aparicoes').eql(1);
                        res.body.should.have.property('_id').eql(planeta._id.toString());
                        done();
                    });
            });
        });
    });
    
    describe('/PUT/:id planetas', ()=>{
        it('Deveria atualizar os dados de um planeta por id.', (done)=>{
            let planeta = new planetaModel({
                nome: "Terra",
                clima: "Arid",
                terreno: "Dessert",
                aparicoes: 0
            });
            planeta.save((erro, response)=>{
                chai.request(app)
                    .put('/api/planetas/' + response._id)
                    .send({
                        nome: "Terra",
                        clima: "Misto",
                        terreno: "Deserto",
                        aparicoes: 0
                    })
                    .end((erro, res)=>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Planeta atualizado!');
                        res.body.should.have.property('planeta');
                        res.body.planeta.should.have.property('clima').eql('Misto');
                        res.body.planeta.should.have.property('terreno').eql('Deserto');
                        res.body.planeta.should.have.property('_id').eql(response._id.toString());
                        done();
                    });
            });
        });
        
        it('Não deveria atualizar acusando a existência de um planeta, já existente, com o mesmo nome.', (done)=>{
            let planeta = new planetaModel({
                nome: "Saturno",
                clima: "Arid",
                terreno: "Dessert",
                aparicoes: 0
            });
            planeta.save((erro, response)=>{
                chai.request(app)
                    .put('/api/planetas/' + response._id)
                    .send({
                        nome: "Tatooine",
                        clima: "Arid",
                        terreno: "Dessert",
                        aparicoes: 5
                    })
                    .end((erro, res)=>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('O planeta já existe no banco de dados.');
                        done();
                    });
            });
        });
    });
    
    describe('/DELETE/:id planetas', ()=>{
        it('Deveria remover um planeta por id.', (done)=>{
            let planeta = new planetaModel({
                nome: "Jupiter",
                clima: "Arid",
                terreno: "Dessert",
                aparicoes: 0
            });
            planeta.save((erro, response)=>{
                chai.request(app)
                    .delete('/api/planetas/' + response._id)
                    .end((erro, res)=>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Planeta excluído.');
                        res.body.should.have.property('result');
                        res.body.result.should.have.property('ok').eql(1);
                        res.body.result.should.have.property('n').eql(1);
                        done();
                    });
            });
        });
    });
});