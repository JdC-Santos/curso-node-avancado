var fs = require('fs');

fs.readFile('wallpaper.png', function(erro, buffer){
    console.log('arquivo lido');

    fs.writeFile('wallpaper2.png',buffer, function(erro){
        console.log('arquivo escrito');
    });
});