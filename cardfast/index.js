const app = require('./config/custom-express')();

app.listen(3001, () => {
    console.log('ouvindo a porta 3001...');
});