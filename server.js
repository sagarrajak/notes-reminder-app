const Koa =  require('koa');
const dotenv = require('dotenv');
const http = require('http');
const logger = require('./src/logger/logger');
const app =  new Koa();

process.env.NODE_ENV = require('./config.js');  //SET environment variable here in file
switch (process.env.NODE_ENV) {
    case 'development':
        dotenv.config({path: '.dev.env'});
        break;
    case 'production':
        dotenv.config({path: '.prod.env'});
        break;
    case 'testing':
        dotenv.config({path: '.test.env'});
        break; 
}
const db = require('./database'); //Database object for query and all 

app.use(async (ctx) => {
    ctx.body = {
        status: 'success',
        message: "Hello, world"
    }
});

const PORT = process.env.PORT||8080;
const server = http.createServer(app.callback());
server.listen(process.env.PORT||8080, () => {
    // console.log(`server is listing at ${PORT}`);
    logger.log('info', 'server is listening at %d', PORT);
});
module.exports = server;