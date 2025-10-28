const winston = require("winston");
const connectdb = require("./env/db");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieparser = require("cookieparser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const authrouters = require("./routers/authrouters");
const mqttrouters = require("./routers/mqttrouters");
const supportemailrouters = require("./routers/supportemailrouters");
const backupdbrouters = require("./routers/backuprouters");

//load environment variable
dotenv.config({path: "./.env"});

//initialize express
const app = express();

//logger configuration
const logger = winston.createlogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamps(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({fielname: "error.log", level: "error"}),
        new winston.transports.File({fielname: "combine.log"}),
    ],
});

//midlleware
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["Content-length", "Content-dispostion"],
        maxAge: 86400
    }),
);
app.use(cookieparser());

//increase request to timeout and enabel chunkked responses
app.use((req, res, next)=>{
    req.setTimeout(60000); //10 minute timeout
    res.setTimeout(60000);// 10 minute timeout
    res.flush || res.flush;// ensure flush is availble
    logger.info(`Requested to set ${req.url}`,{
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
app.use(errorHandler);

//connect to database
connectdb();

//start the server
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", ()=>{
    logger.info(`server is running on port ${port}`);
});