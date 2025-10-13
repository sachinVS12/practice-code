const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHnadler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backupdbrouters");

//load environemnt vaiable
dotenv.config({path: "./.env"});

//initialize express
const app = express();

//logger configuration
const logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        winston.transports.File({ filename: "error.log", level:"error"}),
        winston.transports.File({ filename: "combine"},)
    ],
});

//midleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "http://12.23.45.67:3000",
        methods: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-Length", "Content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//inrease request to timeout and enables chunkked responses
app.use((req, res, next)=>{
    req.setTimeout(6000); //10 minutes timeout
    res.setTimeout(6000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); // flush is avialble
    logger.info(`Requested to : set ${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/auth", authroutersrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use('api/v1/supportemail', supportemailrouters);
app.use("api/v1/backupdb", backupdbrouters);