require('./config/config');
const path =require('path');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.use(express.static(path.resolve(__dirname,"../public")));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,(err,res)=>{
    if(err) throw err;

    console.log("DB ONLINE")
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en ${process.env.PORT}`);
})