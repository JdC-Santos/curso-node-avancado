var memcached = require('memcached');

module.exports = function(){
    return createMemcachedClient;
}

function createMemcachedClient(){
    var cliente = new memcached('localhost:11211',{
        retries: 3,
        retry: 5000,
        remove: true
    });

    return cliente;
}