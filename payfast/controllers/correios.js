module.exports = function(app){
    app.post('/correios/calculo-prazo', function( req, res ) {
        var dadosEntrega =  req.body;

        var correiosSoapClient = new app.servicos.CorreiosSoapClient();

        correiosSoapClient.calculaPrazo(dadosEntrega,function(erro, resultado){
            
            if( erro ) {
                console.log(erro);
                res.status(500).json({'msg':'ocorreu um erro ao calcular o prazo!'});
            }else{
                console.log( resultado );
                res.status(200).json({'dados': resultado,'msg':'calculo realizado com sucesso!'});
            }
        });
    });
}