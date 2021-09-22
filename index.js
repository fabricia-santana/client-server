const bodyParser = require('body-parser');
const express = require('express');
const consign = require('consign');
const expressValidator = require('express-validator');

let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

consign().include('utils').include('routes').into(app);

app.listen( process.env.PORT || 3000, ()=>{

    console.log('servidor rodando!');
})
