const app = require('./app');
require('./database');

async function init(){
    await app.listen(3000);
    console.log("Server en el puerto 3000");
}

init();