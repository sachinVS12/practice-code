const winston = require("winston");
const coonectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const moragn = require("morgan");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/auth-routers");
const mqttrouters = require("./routers/mqttrouters");
const supportemail = require("./routers/supportemailroutes");
const backupdb = require("./routers/backupdb");

//load enivironment variable
dotenv.config({ path: "./.env"});

//initialize express
const app = express();

//Logger configuration
const Logger = winston.createlogger({
    level:"info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level:"error"}),
        new winston.transports.File({ filename: "combine.log"}),
    ],
});

//middlewares
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended:false}));
app.use(
    cors({
        origin: "http://12.34.56.78:3000",
        methgod: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Conetent-Length", "Conetent-dispostion"],
        maxAge: 86400
    })
);
app.use(cookieparser());

//increase request timeout and enable chunnked responses
app.use((req, res, next)=>{
    req.setTimeout(600000); //10 minutes timeout
    res.setTimeout(600000); //10 minutes timeout
    res.flush = res.flush || (()=>{}); //flush is avilabel
    Logger.info(`Request to url: set ${req.url}`,{
        method: req.method,
        body: req.body,
    });
    next();
});

//Routers
app.use("api/v1/auth", authrouters);
app.use("api/v1/mqtt", mqttrouters);
app.use("api/v1/supportmail", supportemail);
app.use("api/v1/backupdb", backupdb);

//errorHandler
app.use(errorHandler);

//database connection
coonectdb();

//start the server
const port = process.env.PORT || 50000;
app.listen(port, "0.0.0.0.0", ()=>{
    Logger.info(`API server is running on port: ${port}`);
});