const {createLogger, format, transports} = require('winston');
const {timestamp, combine} = format;
 /** 
  *const levels = { 
        error: 0, 
        warn: 1, 
        info: 2, 
        verbose: 3, 
        debug: 4, 
        silly: 5 
    };
*/
const loggerDevelopment = createLogger({
    format: combine(
        timestamp(),
        format.splat(),
        format.simple()
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'combined.log'})
    ],
    exitOnError: true,  // In development environment process should exit after error   //Log for verbose and above                   
});

const loggerProduction = createLogger({
    format: combine(
        timestamp(),
        format.splat(),
        format.simple()
    ),
    transports: [
        new transports.File({filename: 'production.log'}),
        new transports.File({filename: 'error.log', level: 'error'}),
    ],
    exitOnError: false,
    level: 'info',    //error for warning and above for 'proudction' environment,
});

if (process.env.NODE_ENV === 'production') {
    module.exports = loggerProduction;    
} else {
    module.exports = loggerDevelopment;
}

