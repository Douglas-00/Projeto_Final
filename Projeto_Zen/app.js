const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const path = require("path");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
const rateLimit = require("express-rate-limit");
const connection = require("./db");

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(express.static(path.join(__dirname, './src')));
app.use(helmet());
app.use(limiter);

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const bodyparser = require("body-parser");
const { response } = require("express");

//Configuração do body parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", function (req, res) {    
    res.sendFile(path.join(__dirname,'./index.html'));
});

app.get("/sobre", function (req, res) {
    res.sendFile(path.join(__dirname,'./Sobre.html'));
    //res.send("Sobre Nós")
});

app.get("/Cursos", function (req, res) {
    res.sendFile(path.join(__dirname,'./Cursos.html'));
    //res.send("Cursos")
});

app.get("/main", function(req, res) {
    console.log('home data', req)
    res.sendFile(path.join(__dirname,'./Main.html'));
})

app.get("/Cadastre-se", function (req, res) {
    res.sendFile(path.join(__dirname,'./Cadastro.html'));
    //res.send("Página de Cadastro")
});



// Fazendo Requisição via POST do Cadastro

  app.post('/src/Cadastro.html',function(req,res){
    var nome = req.body.nome;
    var celular = req.body.celular;
    var email = req.body.email;
    var senha = req.body.senha;
    connection.query("INSERT INTO `usuario` (nome_user,celular_user,email_user,senha) VALUES(?,?,?,?)",[nome,celular,email,senha],function(err,result){
        if(err)throw err;
        console.log("1 usuario inserido")
       

    });
    
    res.redirect('/modal.html');
   // res.send("Cadastrado com Sucesso<br>Nome: "+ nome + "<br>Celular: "+celular+ "<br>Email: "+ email+ "<br>Senha: "+senha)
});

//Parte de Cadastro OK


//Requisição LOGIN



app.post('/auth', function(req,res){
    var email = req.body.email;
    var senha = req.body.senha;

    console.log('COMPLETE DATA', req.body)

    if(email && senha){
        connection.query("SELECT * FROM `usuario` WHERE email_user = ? AND senha = ?",[email,senha],function(error,results,fields){
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.email = email;                
                res.redirect('./Main.html');

                
                
            }else{
                res.send('Email e Senha Incorretos!!');
            };
            
            res.end();
        });
    }else{
        res.send('Por Favor insira seu Email e Senha!');
        res.end();
    }    
    
});




//Localhost
app.listen(8082, console.log('Executando'))