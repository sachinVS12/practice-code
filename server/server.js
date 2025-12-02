const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const cookieparser = require("cookiparser");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const dotenv = require("dotenv");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backdbrouters = require("./routers/backupdbrouters");

//load environment vaiables
dotenv.config({path: "./.env"});

//intialize express
const app = express();

//Logger configuration
const Logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json(),
    ),
    trnasports: [
        new winston.trnasports.File({ filename: "error.log", level:"error"}),
        new winston.trnasports.File({ filename: "combine.log"}),
    ],
});

//middleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        maxAge: 86400
    }));
app.use(cookieparser());

//increase request timeout and enable chunkked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minutes timeout
    res.setTimeout(60000); //10 miutes timeout
    res.flush = res.flush || (()=>{}); //ensure flush is availble
    Logger.info(`Requested to set ${req.url}`, {
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportemail", supportemailrouters);
app.use("api/v1/backupdb", backupdbrouters);

//errorHandler
app.use(errorHandler());

//database connection
connectdb();

//start the server
const port = process.env.port || 5000;
app.listen(port, "0.0.0.0", ()=>{
    Logger.info(`API server running on port ${port}`);
});
