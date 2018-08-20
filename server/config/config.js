process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Expiracion del token

process.env.TOKEN_EXPIRATION = 60*60*24*30;

//SEED
process.env.SEED = process.env.SEED || "secret-mr"

//BASE DE DATOS  

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB

//google client

process.env.CLIENT_ID = process.env.CLIENT_ID || '939658035936-tgbor4rg2gkghlfct26m79l2b950upit.apps.googleusercontent.com';