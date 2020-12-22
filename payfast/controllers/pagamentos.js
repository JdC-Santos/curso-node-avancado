const logger = require("../servicos/logger.js");

module.exports = function(app){
    
    app.get('/pagamentos', ( req , res ) => {
        console.log('sa');
        res.send('ok');
    });

    app.get('/pagamentos/pagamento/:id', ( req , res ) => {
        var id = req.params.id;

        console.log('consultando pagamento '+ id);
        logger.info('consultando pagamento '+ id);

        var memcachedClient = app.servicos.memcachedClient();

        memcachedClient.get('pagamento-'+id,function(erro, retorno){
            if(erro || !retorno){
                console.log("MISS");
                console.log(erro);

                var connection = app.persistencia.connectionFactory;
                var pagamentoDao = new app.persistencia.pagamentoDao(connection);

                pagamentoDao.buscaPorId(id, function(errors, resultado){
                    if(errors){
                        console.log("Erro ao consultar no banco:");
                        console.log(errors);
                        res.status(400).json({
                            msg: 'Não foi possivel carregar o pagamento'
                        });
                    }else{
                        console.log("Pagamento encontrado:");
                        res.json(resultado[0]);
                    }
                });
                
            }else{
                console.log('HIT');
                res.json(retorno);
                achouNoMemcachedClient = true;
            }
        });                
    });

    app.post('/pagamentos/pagamento',[
        
        /* validações do campo [forma_de_pagamento] */
        app.expressValidation.check('forma_de_pagamento','Este campo é obrigatório').notEmpty(),

        /* validações do campo [valor] */
        app.expressValidation.check('valor','Este campo é obrigatório').notEmpty(),
        app.expressValidation.check('valor','Este campo deve ser decimal').isDecimal(),

      ],( req , res ) => {

        var errors = app.expressValidation.validationResult(req.body.pagamento);
        
        if(!errors.isEmpty()){
            console.log(errors);
            res.status(400).json(errors);
            return;
        }

        var pagamento = req.body.pagamento;

        pagamento.status = 'criado';
        pagamento.data = new Date();

        var connection = app.persistencia.connectionFactory;
        var pagamentoDao = new app.persistencia.pagamentoDao(connection);

        pagamentoDao.salva(pagamento, (error, resultado) => {
            if ( error ) {
                
                console.log('erro:');
                console.log(error);

                res.status(500).json({
                    ...pagamento,
                    msg :'Não foi possivel realizar o pagamento.'
                });

            }else{
                pagamento.id = resultado.insertId;

                var memcachedClient = app.servicos.memcachedClient();

                memcachedClient.set('pagamento-'+pagamento.id,pagamento,60000, function(erro, retorno){
                    if(erro){
                        console.log(erro);
                    }else{
                        console.log('nova chave');
                    }
                });

                if( pagamento.forma_de_pagamento == "cartao" ) {
                    var cartao = req.body.cartao;

                    var ClientCartoes = new app.servicos.ClientCartoes();

                    ClientCartoes.autoriza(cartao, function(exception, request, response, retorno){
                        if ( exception ) {
                            
                            console.log(exception);
                            res.status(400).json({...exception,'msg':'Cartão nao autorizado'});

                        }else{
                            
                            console.log(retorno);

                            res.location( 'pagamentos/pagamento/' + pagamento.id );

                            var response = {
                                dados_do_pagamento: pagamento,
                                cartao: retorno,
                                links: [
                                    {
                                        href: 'http://localhost:3000/pagamentos/pagamento/'+ pagamento.id,
                                        rel: 'CONFIRMAR',
                                        method: 'PUT'
                                    },
                                    {
                                        href: 'http://localhost:3000/pagamentos/pagamento/'+ pagamento.id,
                                        rel: 'CANCELAR',
                                        method: 'DELETE'
                                    }
                                ]
                            }
        
                            res.status(201).json(response);
                        }
                    });

                    
                    return;

                } else {
                    res.location( 'pagamentos/pagamento/' + pagamento.id );

                    var response = {
                        dados_do_pagamento: pagamento,
                        links: [
                            {
                                href: 'http://localhost:3000/pagamentos/pagamento/'+ pagamento.id,
                                rel: 'CONFIRMAR',
                                method: 'PUT'
                            },
                            {
                                href: 'http://localhost:3000/pagamentos/pagamento/'+ pagamento.id,
                                rel: 'CANCELAR',
                                method: 'DELETE'
                            }
                        ]
                    }

                    res.status(201).json(response);
                }
            }
        });
    });

    app.put('/pagamentos/pagamento/:id', function ( req, res ){
        var pagamento = {};
        pagamento.id = req.params.id;
        pagamento.status = 'confirmado';

        var connection = app.persistencia.connectionFactory;
        var pagamentoDao = new app.persistencia.pagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(error, resultado){
            if ( error ) {
                
                console.log(error);
                
                res.status(500).json({
                    ... error,
                    msg:'não foi possivel atualizar o pagamento.'
                });

            }else{
                
                console.log('pagamento realizado com sucesso.');

                res.status(200).json({
                    msg: 'pagamento atualizado com sucesso.'
                });
            }
        });
    });

    app.delete('/pagamentos/pagamento/:id', function ( req , res ) {
        
        var pagamento = {
            id : req.params.id,
            status: 'cancelado'
        }

        var connection = app.persistencia.connectionFactory;
        var pagamentoDao = new app.persistencia.pagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function ( errors, resultado ) {
            
            if ( errors ) {
                
                console.log('erro ao deletar o pagamento');
                
                res.status(500).json({
                    ...errors,
                    msg: 'Não foi possivel deletar o pagamento'
                });

            }else{
                console.log('pagamento cancelado com sucesso');

                res.status(204).json({
                    ...resultado,
                    msg: 'pagamento cancelado com sucesso'
                });
            }

        });
    });
}
