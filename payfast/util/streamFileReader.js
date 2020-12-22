var fs = require('fs');

fs.createReadStream('wallpaper.png')
    .pipe(fs.createWriteStream('wallpaper3.png'))
    .on('finish',function(){
        console.log('arquivo escrito com stream');
    });
