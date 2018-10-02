
const config = {  
    //prod = production, dev = running node on same machine, staging = staging, localnetwork means running on  
    ENVIRONMENT:'dev', 
    SECRET: 'PlguGX,Y%HJ$):)PDdy^',
    // this key will be used to identify the jsonwebtoken 
    INJECTED_KEY: 'e&aSzyJ((,tZz[U:;PWc&nLje[.jo)jHW~[xb$Ga',
    TOKEN_ALLOWED_FOR_HOW_LONG: '2 days',
    EMAIL_ID: 'letsdevindia@gmail.com',
    EMAIL_PASSWORD: 'Winter1011',
    USEQ: false,
    LOG_LEVEL: 1,
    LOGS_TO_ACCUMULATE: 0,
    ENCRYPTION_SALT: 'A37u172sSFS9O9JNHs82u38djdncnvyz9',
    OPR_KEY: 'JHJH54EWDGCKHLKJhhhgg655544fdFCghklkhjoi9',
    DB_ROWS_LIMIT: 50,
    DEBUG: true,
    DEBUG_URL: 'http://localhost:3000/#',
    PROD_URL: 'http://ebframework.edgebits.io/#'
};

const sequelizeConfig = {
    dev: {
        "host": "45.126.210.130",
        "username": "bpuser",
        "password": "y[mGW!o,Lp[fwz@GiamW",
        "database": "boilerplate",
        "dialect": "mysql",
        "multipleStatements": true
      },
      prod: {
        "host": "localhost",
        "username": "bpuser",
        "password": "y[mGW!o,Lp[fwz@GiamW",
        "database": "boilerplate",
        "dialect": "mysql",
        "multipleStatements": true
      }
}


module.exports.config = config;
module.exports.sequelizeConfig = sequelizeConfig;