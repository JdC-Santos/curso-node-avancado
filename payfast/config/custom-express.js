var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var { check, validationResult } = require('express-validator');
var morgan = require('morgan');
const logger = require("../servicos/logger.js");

module.exports = function(){
    var app = express();

    app.use(morgan("common",{
        stream: {
            write: function(msg){
                logger.info(msg);
            }
        }
    }));

    app.use( bodyParser.urlencoded({ extended:true }) );
    app.use( bodyParser.json() );
    
    app.expressValidation = { check, validationResult };

    consign()
        .include('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);

    return app;
}