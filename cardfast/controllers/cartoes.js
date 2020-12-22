module.exports = (app) => {

    app.post('/cartoes/autoriza',[
        /**
         * validações do campo [numero]
         */
        app.expressValidation.check('numero','O número é obrigatório').not().isEmpty(),
        app.expressValidation.check('numero','deve conter apenas números').isNumeric(),
        app.expressValidation.check('numero','deve conter 16 números').isLength({min:16,max:16}),

        /**
         * validações do campo [bandeira]
         */
        app.expressValidation.check('bandeira','A bandeira é obrigatória').not().isEmpty(),

        /**
         * validações do campo [ano_expiracao]
         */
        app.expressValidation.check('ano_expiracao','O ano de expiração é obrigatório').not().isEmpty(),
        app.expressValidation.check('ano_expiracao','O ano de expiração deve ter apenas números').isNumeric(),
        app.expressValidation.check('ano_expiracao','deve conter 4 digitos').isLength({min:4,max:4}),

        /**
         * validações do campo [mes_expiracao]
         */
        app.expressValidation.check('mes_expiracao','O mês de expiração é obrigatório').not().isEmpty(),
        app.expressValidation.check('mes_expiracao','O mês de expiração deve ter apenas números').isNumeric(),
        app.expressValidation.check('mes_expiracao','deve conter até 2 digitos').isLength({min:1,max:2}),

        /**
         * validações do campo [ccv]
         */
        app.expressValidation.check('ccv','O CCV é obrigatório').not().isEmpty(),
        app.expressValidation.check('ccv','O CCV apenas números').isNumeric(),
        app.expressValidation.check('ccv','deve conter 3 digitos').isLength({min:3,max:3}),

    ],function(req, res){

        console.log('processando pagamento com cartão.');

        var validationErrors = app.expressValidation.validationResult(req);
        
        if(!validationErrors.isEmpty()){
            console.log("Erros de validação encontrados");
            res.status(400).json(validationErrors);
            return;
        }

        var cartao = req.body;
        cartao.status = 'autorizado';

        var response = {
            dados_do_cartao: cartao,

        }

        res.status(201).json(response);
    });
}