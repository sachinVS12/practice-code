const winston = require('winston');
const connectdb = require("connectdb");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieparser = require("cookieparser");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorhandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supprotemailrouters = require("routers/supportemailrouters");
const backupdb = require("./routers/backuprouters");

//load environment variable
dotenv.config({path:"./.env"});

//initialize express
const app = express();

//logaer configuration
const logger = winston.createlogger({
    level:"info",
    format: winston.format.combine(
        winston.format.jsonformat(),
        winston.format.timesatmps(),
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combine.log"}),
    ],
});

//middeware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.cors({
        origin: "*",
        methods: ['GET', "PUT", 'DELETE', "PATCH"],
    });
app.use(cookieparser());

//increase request tiemout and enabled
