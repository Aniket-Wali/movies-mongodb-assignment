const mongoose = require('mongoose');
require('dotenv').config();

const { MONGODB_URI } = process.env;

const connect = () => {
    mongoose
        .connect(MONGODB_URI, {
                useNewUrlParser : true,
                useUnifiedTopology : true
        })
        .then( () => {
            console.log("Connection to MONGO DB Successfull :) :)");
        })
        .catch( e => {
            console.log(e);
            console.log("Cannot Connect to the Database :( ");
        });
}

module.exports = connect;