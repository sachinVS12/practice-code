const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const cookieparser = require('cokieparser');
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorHnadler = require("./middleware/error");
const authrouters = require("./routers/auth-routers");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backubdbrouters");

//load environment variable
dotenv.congig({ path: "./.env"});

//initialize express
const app = express();

//logger configuration
const Logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combine.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: "https://12.34.34.56:3000",
        method: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-length", "Content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increment request timeout and enables chunkked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); //flush is avialbels
    Logger.info(`Request to : set${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/authroute", authrouters);
app.use("api/v1/mqttt", mqttrouters);
app.use('api/v1/supportemail', supportemailrouter);
app.use("api/v1/backupdb", backupdbrouters);

//errorhandler
app.use(errorHnadler);

//database connection
connectdb();

//start the server
const port = process.env.POTRT || 5000;
app.listen(port, "0.0.0.0", ()=>{
    Logger.info(`port server running on: ${port}`);
});