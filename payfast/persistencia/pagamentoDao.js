function pagamentoDao( connection ) {
    this._connection = connection;
}
pagamentoDao.prototype = {
    salva: function( pagamento, callback ) {
        this._connection.query('INSERT INTO pagamentos SET ?',pagamento,callback);
    },
    atualiza: function( pagamento, callback ) {
        this._connection.query('UPDATE pagamentos SET ? WHERE id= ? ',[pagamento,pagamento.id],callback);
    },
    lista: function( callback ) {
        this._connection.query('SELECT * FROM pagamentos',callback);
    },
    buscaPorId: function( id, callback ) {
        this._connection.query('SELECT * FROM pagamentos WHERE id = ?',id,callback);
    },
    deleta: function(pagamento, callback){
        this._connection.query('DELETE FROM pagamentos WHERE id = ?',pagamento.id,callback);
    }
}

module.exports = function(){
    return pagamentoDao;
}