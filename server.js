const Koa =  require('koa');
const dotenv = require('dotenv');
const http = require('http');
const logger = require('./src/logger/logger').logger;
const requestLogger = require('./src/logger/logger').requestLogger;
const koaBody = require('koa-body'); 
const app =  new Koa();

//Api imported here 
const notes = require('./src/api/notes');

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

// A middleware to log requests
app.use(koaBody());
app.use(async (ctx, next) => {
    await next();
    requestLogger.info(ctx.origin+ctx.url + ' '+ctx.method+' '+ctx.status);
});

app.on('error', (err, ctx) => {
    logger.log('error', err);
    if (process.env.NODE_ENV === 'development') {
        throw err;
    }
}); 

app.use(notes);

const PORT = process.env.PORT||8080;
const server = http.createServer(app.callback());
server.listen(process.env.PORT||8080, () => {
    // console.log(`server is listing at ${PORT}`);
    logger.log('info', 'server is listening at %d', PORT);
});
module.exports = server;