const Koa =  require('koa');
const dotenv = require('dotenv');
const http = require('http');
const mongoose = require('mongoose');

const app =  new Koa();
dotenv.config({path: '.dev.env'});
app.use(async (ctx) => {
    ctx.body = {
        status: 'success',
        message: "Hello, world"
    }
});

const PORT = process.env.PORT||8080;
const server = app.listen(process.env.PORT||8080, () => {
     console.log(`server is listing at ${PORT}`);
});

module.exports = server;