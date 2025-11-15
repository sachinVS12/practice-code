const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieparser = require('cookiparser');
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const errorhandler = require("middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemail = require("./routers/supprotemailrouters");
const backdbrouters = require("./routers/backdbrouters");

//load Environment variable
dotenv.config({path: "./.env"});

//initialize Express
const app = express();

//Logger configuration
const logger = winston.createlogger({
    level:"info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.jsonformat()
    ),
    transports :[
        new winston.transports.file({filename: "error.log", level: 'error'}),
        new winston.transports.file({filename: "combine.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended: false}));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PATCH"],
        exposedHeaders: ["content-length", "content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increase request to timeout and enable chunkked response
app.use((req, res, next)=>{
    req.setTimeout(60000);  // 10  min timeout
    res.setTimeout(60000); //10 min timeout
    res.flush = res.flush || (()=>{}); //ensure flush is availble
    logger.info(`requested to${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use('api/v1/supportemail', supportemailrouters);
app.use("api/v1/backupdb", backupdbrouters);

//errorHandler
app.use(errorhandler);

//connectdb
connectdb();

//star the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0",()=>{
  logger.info(`server on running on ${prot}`);
});
