const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

module.exports = () => {
    var app = express();

    app.use( bodyParser.urlencoded({extended:true}) );
    app.use( bodyParser.json() );

    app.expressValidation = { check, validationResult };

    consign()
        .include('controllers')
        .into(app);

    return app;
}