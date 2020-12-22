const soap = require('soap');

function CorreiosSoapClient(){
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl'; 
}
CorreiosSoapClient.prototype = {
    calculaPrazo: function(dadosEntrega, callback){
        soap.createClient(this._url,function(erro, cliente){
            
            if(erro){
                console.log("erro ao carregar soap");
                console.log(erro);
            }else{
                console.log('cliente soap criado');
                cliente.CalcPrazo(dadosEntrega, callback);
            } 
        });
    }
}

module.exports = function(){
    return CorreiosSoapClient;
}
