const mongoose = require('mongoose');
const url = require('url');
const logger = require('./src/logger/logger').logger;

if (process.env.NODE_ENV === 'development') {
    mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}, (err) => {
        if(err)
            logger.log('error', err);
        else {
            logger.info('connected to database!');
        }
    });
} 
else if (process.env.NODE_ENV === 'testing') {
    mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}, (err) => {
        if(err)
            logger.log('error', err);
        else {
            logger.info('connected to database!');
        }
    });
} 
else if (process.env.NODE_ENV === 'production') {
    const auth = [process.env.DB_USERNAME, ':', process.env.DB_PASSWORD].join('');
    const mongoUrl = url.format({
        protocol: 'mongodb:',
        slashes: true,
        auth: auth,
        hostname: process.env.DB_HOST,
        port: process.env.DB_PORT,
        hash: null,
        search: null,
        query: null,
        pathname: '/' + process.env.DB_PATHNAME
    });
    mongoose.connect(mongoUrl, {useNewUrlParser: true} , (err) => {
        if(err)
            logger.log('error', err);
        else {
            logger.info('connected to database!');
        }
    })
}
console.log(`server is running as ${process.env.NODE_ENV} environment`);
module.exports = mongoose;